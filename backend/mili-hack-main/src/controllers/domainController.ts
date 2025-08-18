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
  getAllRegistrars 
} from "../lib/registrarService";

// Check a single domain availability
export const checkDomain = async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    if (!domain) return res.status(400).json({ error: "Domain parameter is required" });

    const availability = await checkDomainAvailability(domain);
    const pricing = getDomainPricing(domain);

    res.json({
      success: true,
      ...availability,
      pricing,
      bestPrice: pricing.length ? pricing[0] : null
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
        const pricing = getDomainPricing(d);
        return { ...avail, pricing, bestPrice: pricing.length ? pricing[0] : null };
      } catch (err: any) {
        return { domain: d, available: false, message: err.message, pricing: [], bestPrice: null };
      }
    }));

    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ error: "Bulk check failed", message: error.message });
  }
};

// Domain suggestions with pricing
export const suggestions = async (req: Request, res: Response) => {
  try {
    const { baseName } = req.params;
    if (!baseName) return res.status(400).json({ error: "Base name required" });

    const suggested = generateDomainSuggestions(baseName);

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
