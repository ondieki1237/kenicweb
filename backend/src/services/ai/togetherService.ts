
import { apiClient } from "../../utils/apiClient";

const TOGETHER_API_URL = "https://api.together.xyz/v1/completions";

export class TogetherService {
  static async brainstormDomains(keyword: string): Promise<string[]> {
    const response = await apiClient.post(
      TOGETHER_API_URL,
      {
        model: "togethercomputer/llama-2-70b-chat",
        prompt: `Suggest creative domain names for: ${keyword}`,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0]?.text || "";
    return text.split("\n").filter((line: string) => line.trim() !== "");
  }
}
