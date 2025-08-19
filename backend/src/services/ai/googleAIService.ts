import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY";

export const googleAISuggestion = async (prompt: string) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GOOGLE_API_KEY,
        },
      }
    );

    // Extract AI-generated text
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "No suggestion returned";
  } catch (error: any) {
    console.error("Google AI request failed:", error.response?.data || error.message);
    throw new Error("Google AI request failed");
  }
};
