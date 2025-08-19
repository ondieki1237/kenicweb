// src/services/ai/aiFactoryService.ts
import { GroqService } from "./groqService";
import { TogetherService } from "./togetherService";
import { ReplicateService } from "./replicatService";
import { googleAISuggestion } from "./googleAIService"; // ✅ updated import


// Centralized AI suggestion factory
export async function getAISuggestions(businessDescription: string): Promise<string[]> {
  let suggestions: string[] = [];

  // 1️⃣ Try Google Gemini first
  try {
    const googleResult = await googleAISuggestion(
      `Suggest 5 short, brandable domain names ending with .ke for a business that does: ${businessDescription}.
      Return only the names, comma-separated.`
    );

    if (googleResult) {
      // Split Google result into array (in case it returns multiple names in a single string)
      suggestions = googleResult
        .split(/[\n,]+/) // split on commas or line breaks
        .map(s => s.trim())
        .filter(s => s.length > 0);

      console.log("✅ Google Gemini succeeded:", suggestions);
    }
  } catch (error: any) {
    console.error("Google Gemini failed, trying Groq:", error.message);
  }

  // 2️⃣ If Google gave nothing, fallback to Groq
  if (suggestions.length === 0) {
    try {
      suggestions = await GroqService.generateDomainIdeas(
        `Suggest 5 short, brandable domain names ending with .ke for a business that does: ${businessDescription}.
        Return only the names, no extra text.`
      );
      console.log("✅ Groq succeeded");
    } catch (error: any) {
      console.error("Groq failed, trying Together:", error.message);
    }
  }

  // 3️⃣ If still nothing, fallback to Together
  if (suggestions.length === 0) {
    try {
      suggestions = await TogetherService.brainstormDomains(businessDescription);
      console.log("✅ Together succeeded");
    } catch (error2: any) {
      console.error("Together failed, trying Replicate:", error2.message);
    }
  }

  // 4️⃣ Last fallback → Replicate (currently mocked with logo gen URL)
  if (suggestions.length === 0) {
    try {
      const logoPrompt = `Suggest creative .ke domain names for: ${businessDescription}. Return text only.`;
      const replicateResult = await ReplicateService.generateLogo(logoPrompt);

      // NOTE: Replicate is using an image gen model now → just placeholder text
      suggestions = [replicateResult];
      console.log("✅ Replicate succeeded (logo repurposed as text placeholder)");
    } catch (error3: any) {
      console.error("Replicate failed completely:", error3.message);
      throw new Error("All AI providers failed to generate domain suggestions");
    }
  }

  // 🔄 Ensure every suggestion ends with .ke
  return suggestions.map(s =>
    s.toLowerCase().endsWith(".ke")
      ? s
      : `${s.replace(/\s+/g, "").toLowerCase()}.ke`
  );
}
