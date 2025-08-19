

import { generateDomainIdeas } from "./aiDomainService";
import { checkDomainAvailability } from "../../lib/whoisService";
import { DomainSuggestion, getDomainPricing } from "../../lib/registrarService"; // Updated import

export async function getAvailableDomains(businessDesc: string): Promise<DomainSuggestion[]> {
  const suggestions: DomainSuggestion[] = [];
  const seen = new Set<string>();

  while (suggestions.length < 5) {
    try {
      const ideas = await generateDomainIdeas(businessDesc);

      for (const idea of ideas) {
        if (seen.has(idea)) continue;
        seen.add(idea);

        const result = await checkDomainAvailability(idea);

        if (result.available) {
          const pricing = getDomainPricing(result.domain); // Always fetch pricing
          if (pricing.length > 0) {
            const bestPrice = pricing[0];
            suggestions.push({
              domain: result.domain,
              bestPrice,
              allPricing: pricing,
              available: result.available,
              expiryDate: result.whoisData?.expiryDate || undefined, // Add WHOIS expiry
            });
            if (suggestions.length === 5) break;
          }
        }
      }
    } catch (error) {
      console.error(`Error processing suggestions: ${(error as Error).message}`);
      break;
    }
  }

  return suggestions.length >= 5 ? suggestions : [];
}