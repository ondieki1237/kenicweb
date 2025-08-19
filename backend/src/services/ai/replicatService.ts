
import { apiClient } from "../../utils/apiClient"; // Corrected path

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

export class ReplicateService {
  static async generateLogo(prompt: string): Promise<string> {
    const response = await apiClient.post(
      REPLICATE_API_URL,
      {
        version: "stability-ai/stable-diffusion", // example model
        input: { prompt },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.urls.get; // returns prediction result URL
  }
}
