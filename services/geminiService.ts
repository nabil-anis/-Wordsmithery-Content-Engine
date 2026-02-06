
import { GoogleGenAI } from "@google/genai";

export interface GenerateContentParams {
  toneName: string;
  toneDescription: string;
  region: string;
  promotion: string;
  details: string;
}

export const generateContent = async (params: GenerateContentParams): Promise<string> => {
  const { toneName, toneDescription, region, promotion, details } = params;

  // Initialize the Gemini API client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `You are a world-class Senior Brand Strategist and Expert Copywriter at a global luxury hospitality group. 
Your task is to craft highly compelling, region-specific marketing content for the brand "${toneName}".

BRAND DNA FOR ${toneName}:
${toneDescription}

GUIDELINES:
1. ADAPT TO REGION: Ensure the cultural nuances, idioms, and values of "${region}" are reflected.
2. CAMPAIGN CONTEXT: This is for a "${promotion}".
3. KEY DETAILS: ${details}
4. FORMAT: Provide the content as a finished marketing draft. Do not include meta-commentary like "Here is your copy."
5. TONE: Stick strictly to the brand identity provided above.`;

  const userPrompt = `Generate a marketing message for the ${region} region about our ${promotion}. 
  The specific campaign details are: ${details}. 
  Ensure it embodies the ${toneName} identity perfectly.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95,
        topK: 64,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned empty content.");
    }
    
    return text.trim();
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to weave content with Gemini Intelligence.");
  }
};
