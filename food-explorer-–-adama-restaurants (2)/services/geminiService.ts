
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are "Adama Foodie", a friendly and professional AI assistant for the "Food Explorer – Adama Restaurants" website.
Your goal is to help users discover the best places to eat in Adama (also known as Nazret), Ethiopia.
You have extensive knowledge about local specialties like Kitfo, Beyaynetu, and the famous Adama breakfast culture (Foul, Chechebsa).
Always be helpful, polite, and descriptive. If a user asks for a recommendation, provide 2-3 specific places and mention their signature dishes.
Keep responses concise but engaging.
`;

export async function getGeminiResponse(userMessage: string, history: ChatMessage[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    const response = await model;
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to my culinary database. Please try again later!";
  }
}
