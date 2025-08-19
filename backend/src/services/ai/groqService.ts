
import { apiClient } from "../../utils/apiClient";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export class GroqService {
  static async generateDomainIdeas(prompt: string): Promise<string[]> {
    const response = await apiClient.post(
      GROQ_API_URL,
      {
        model: "mixtral-8x7b-32768", // or any supported Groq model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0]?.message?.content || "";
    return text.split("\n").filter((line: string) => line.trim() !== "");
  }
}
