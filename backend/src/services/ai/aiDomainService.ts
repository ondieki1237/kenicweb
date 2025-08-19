

// src/services/ai/aiDomainService.ts
import pLimit from "p-limit";
import { checkDomainAvailability } from "../../lib/whoisService";
import { getDomainPricing, DomainPricing } from "../../lib/registrarService"; // Updated import
import axios from "axios";
import { ParsedWhois } from "../../lib/whoisService";

const ALLOWED_KE_EXTENSIONS = [
  ".ke",
  ".co.ke",
  ".or.ke",
  ".ac.ke",
  ".sc.ke",
  ".go.ke",
  ".me.ke",
];

const CONCURRENCY = Number(process.env.AI_DOMAIN_CONCURRENCY || 5);

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

/**
 * Call Google Generative Language API (Gemini) to generate raw name ideas.
 */
export async function generateDomainIdeas(businessDescription: string): Promise<string[]> {
  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `Suggest 10 short, catchy domain names for this business: "${businessDescription}". 
                   They must be suitable for .ke extensions. 
                   Only return raw names without explanations.`,
          },
        ],
      },
    ],
  };

  const response = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text.split("\n").map((line: string) => line.trim().toLowerCase()).filter((line: string) => line.length > 0);
}

function ensureKeExtension(name: string): string[] {
  const lower = name.toLowerCase();
  const matching = ALLOWED_KE_EXTENSIONS.find((ext) => lower.endsWith(ext));
  if (matching) return [lower];

  const base = toSlug(name);
  return [
    `${base}.co.ke`,
    `${base}.ke`,
    `${base}.or.ke`,
    `${base}.ac.ke`,
    `${base}.sc.ke`,
    `${base}.go.ke`,
    `${base}.me.ke`,
  ];
}

export interface AISuggestResultItem {
  domain: string;
  available: boolean;
  whoisData: ParsedWhois | null;
  pricing: DomainPricing[]; // Updated to reflect registerUrl
  bestPrice: DomainPricing | null; // Updated to reflect registerUrl
  expiryDate?: string; // Added to match DomainSuggestion
}

export interface AISuggestResult {
  success: boolean;
  businessDescription: string;
  count: number;
  suggestions: AISuggestResultItem[];
}

export async function aiSuggestAvailableKeDomains(
  businessDescription: string,
  maxDomains: number = 5
): Promise<AISuggestResult> {
  try {
    const raw = await generateDomainIdeas(businessDescription);
    const expanded = raw.flatMap(ensureKeExtension);
    const unique = Array.from(new Set(expanded));

    const limit = pLimit(CONCURRENCY);
    const checks = unique.map((domain) =>
      limit(async () => {
        try {
          const availability = await checkDomainAvailability(domain);
          if (!availability.available) return null;
          const pricing = getDomainPricing(domain);
          const bestPrice = pricing.length > 0 ? pricing[0] : null;

          return {
            domain: availability.domain,
            available: availability.available,
            whoisData: availability.whoisData,
            pricing,
            bestPrice,
            expiryDate: availability.whoisData?.expiryDate || undefined, // Integrate WHOIS expiry
          } as AISuggestResultItem;
        } catch (err: any) {
          console.error(`[AI Domain] Failed for ${domain}:`, err.message);
          return null;
        }
      })
    );

    const evaluated = (await Promise.all(checks)).filter(Boolean) as AISuggestResultItem[];
    const sorted = evaluated.sort((a, b) => {
      const ap = a.bestPrice?.price ?? Number.MAX_SAFE_INTEGER;
      const bp = b.bestPrice?.price ?? Number.MAX_SAFE_INTEGER;
      return ap - bp;
    });
    const top = sorted.slice(0, maxDomains);

    return {
      success: true,
      businessDescription,
      count: top.length,
      suggestions: top,
    };
  } catch (error: any) {
    console.error(`[AI Domain] Error in suggestion process: ${error.message}`);
    return {
      success: false,
      businessDescription,
      count: 0,
      suggestions: [],
    };
  }
}