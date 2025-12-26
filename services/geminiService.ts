
import { GoogleGenAI, Type } from "@google/genai";
import { AuditRequest, AuditResponse } from "../types";

export const generateAuditResponse = async (data: AuditRequest): Promise<AuditResponse> => {
  const apiKey = process.env.API_KEY;

  // Fallback response if API Key is missing or service is down
  const fallbackResponse: AuditResponse = {
    analysis: `The ${data.brandName} footprint in the marketplace suggests a significant opportunity for predatory expansion. While our automated systems are calibrating for your specific category, our Lead Strategists have been notified of your data.`,
    quickWins: [
      "Immediate audit of high-ACOS keywords for 'bleeding' spend.",
      "Defensive targeting scan to protect your core branded search terms.",
      "Listing health check to ensure maximum conversion 'plumage' is active."
    ],
    strategicVision: "Your brand is positioned for a vertical climb. We recommend a focused 15-minute alignment call to map out a precise flight path to category dominance."
  };

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn("Gemini API Key missing. Returning fallback response.");
    // Wait slightly to simulate 'thinking' for a better user experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    return fallbackResponse;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are the 'Lead Digital Falconer' for e-Falconry, an elite Amazon growth agency.
    Analyze the following brand as if you are a predator scanning the marketplace from 10,000 feet.
    Brand: ${data.brandName}
    Monthly Revenue: ${data.monthlyRevenue}
    Current ACOS: ${data.currentAcos}
    Primary Pain Point: ${data.topPainPoint}

    Your tone must be sophisticated, lethal in its precision, and use falconry metaphors (sight, talons, flight paths, apex predators).
    
    IMPORTANT: Never mention you are an AI. Present this as a proprietary strategic analysis from the e-Falconry Studio.
    
    Structure your response as:
    1. 'The Scan' (Analysis): A high-altitude look at their current position.
    2. 'The Dive' (Quick Wins): 3-4 lethal, immediate tactical strikes to increase profit.
    3. 'The Apex Vision' (Strategic Vision): How they become the dominant predator in their category.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A high-altitude analysis of their current marketplace position."
            },
            quickWins: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 immediate tactical strikes."
            },
            strategicVision: {
              type: Type.STRING,
              description: "The path to becoming a category apex predator."
            }
          },
          required: ["analysis", "quickWins", "strategicVision"]
        }
      }
    });

    if (!response.text) return fallbackResponse;
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallbackResponse;
  }
};
