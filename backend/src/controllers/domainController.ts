
import { Request, Response } from "express";
import { 
  checkDomainAvailability, 
  whoisLookup, 
  parseWhoisResponse, 
  isDomainAvailable 
} from "../lib/whoisService";
import { 
  getDomainPricing, 
  generateDomainSuggestions, 
  getAllRegistrars, 
  getAveragePrice // Added for extra value
} from "../lib/registrarService";

import { getAISuggestions } from "../services/ai/aiFactoryService";
import { aiSuggestAvailableKeDomains } from "../services/ai/aiDomainService";

// Check a single domain availability
export const checkDomain = async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    if (!domain) return res.status(400).json({ error: "Domain parameter is required" });

    const availability = await checkDomainAvailability(domain);
    const pricing = getDomainPricing(availability.domain); // Always fetch pricing
    const averagePrice = pricing.length > 0 ? getAveragePrice(availability.domain) : null; // Added average price

    res.json({
      success: true,
      ...availability,
      pricing,
      bestPrice: pricing.length ? pricing[0] : null,
      averagePrice // Added for additional insight
    });
  } catch (error: any) {
    res.status(500).json({ error: "WHOIS check failed", message: error.message });
  }
};

// Detailed WHOIS lookup
export const whois = async (req: Request, res: Response) => {
  try {
    let { domain } = req.params;
    if (!domain.toLowerCase().endsWith(".ke")) domain += ".co.ke";

    const whoisDataRaw = await whoisLookup(domain);
    const parsed = parseWhoisResponse(whoisDataRaw);

    res.json({
      success: true,
      domain,
      whoisData: parsed,
      available: isDomainAvailable(whoisDataRaw)
    });
  } catch (error: any) {
    res.status(500).json({ error: "WHOIS lookup failed", message: error.message });
  }
};

// Bulk domain availability check
export const bulkCheck = async (req: Request, res: Response) => {
  try {
    const { domains } = req.body;
    if (!domains || !Array.isArray(domains)) return res.status(400).json({ error: "Domains array required" });
    if (domains.length > 10) return res.status(400).json({ error: "Max 10 domains allowed" });

    const results = await Promise.all(domains.map(async (d: string) => {
      try {
        const avail = await checkDomainAvailability(d);
        const pricing = getDomainPricing(avail.domain); // Always fetch pricing
        return { ...avail, pricing, bestPrice: pricing.length ? pricing[0] : null, averagePrice: pricing.length > 0 ? getAveragePrice(avail.domain) : null };
      } catch (err: any) {
        return { domain: d, available: false, message: err.message, pricing: [], bestPrice: null, averagePrice: null };
      }
    }));

    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ error: "Bulk check failed", message: error.message });
  }
};

// Domain suggestions with pricing and availability
export const suggestions = async (req: Request, res: Response) => {
  try {
    const { baseName } = req.params;
    if (!baseName) return res.status(400).json({ error: "Base name required" });

    const suggested = await Promise.all(generateDomainSuggestions(baseName).map(async (suggestion) => {
      const availability = await checkDomainAvailability(suggestion.domain);
      const pricing = getDomainPricing(suggestion.domain);
      return {
        ...suggestion,
        available: availability.available,
        pricing,
        bestPrice: pricing.length ? pricing[0] : null,
        averagePrice: pricing.length > 0 ? getAveragePrice(suggestion.domain) : null
      };
    }));

    res.json({
      success: true,
      baseName,
      suggestions: suggested
    });
  } catch (error: any) {
    res.status(500).json({ error: "Suggestion failed", message: error.message });
  }
};

// List all registrars
export const registrars = async (_req: Request, res: Response) => {
  try {
    const list = getAllRegistrars();
    res.json({ success: true, registrars: list });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch registrars", message: error.message });
  }
};

// AI-powered domain suggestion
export const aiSuggestDomain = async (req: Request, res: Response) => {
  try {
    const { businessDescription, max } = req.body;
    if (!businessDescription) {
      return res.status(400).json({ error: "Business description required" });
    }

    const maxDomains = Number(max) > 0 ? Number(max) : 5;

    const result = await aiSuggestAvailableKeDomains(businessDescription, maxDomains);

    // If none found, still return success but empty suggestions (UX-friendly)
    return res.json(result);
  } catch (error: any) {
    console.error(`AI suggestion failed at ${new Date().toISOString()}:`, error);
    return res.status(500).json({ error: "AI suggestion failed", message: error.message });
  }
};