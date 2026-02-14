import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IDocument } from "../models/Document";
import { truncateText } from "../utils/textProcessing";

// Model names
const VOYAGE_MODEL = "voyage-3-large"; 
const GEMINI_MODEL = "gemini-2.5-flash"; // User requested version

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate text embeddings using Voyage AI
 */
export const generateEmbedding = async (text: string): Promise<number[] | null> => {
  try {
    if (!text || text.trim().length === 0) return null;

    console.log(`🔢 Generating embedding with Voyage AI (${VOYAGE_MODEL})...`);
    
    const response = await axios.post(
      "https://api.voyageai.com/v1/embeddings",
      {
        input: text,
        model: VOYAGE_MODEL,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data && response.data.data && response.data.data[0]) {
      const embedding = response.data.data[0].embedding;
      console.log(`✅ Embedding generated successfully (${embedding.length} dimensions)`);
      return Array.from(embedding);
    }

    throw new Error("Empty embedding returned from Voyage");
  } catch (error: any) {
    console.error("❌ Error generating embedding with Voyage:", error.message);
    return null;
  }
};

/**
 * Generate AI response using Google Gemini
 */
export const generateAIResponse = async (
  question: string,
  context: Array<IDocument & { similarity?: number }> = [],
): Promise<string | { text: string; sources: any[] }> => {
  try {
    console.log(`🤖 Generating AI response with ${GEMINI_MODEL}...`);

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Build context from documents
    let contextText = "";
    if (context.length > 0) {
      contextText = "\n\nRelevant Information from Adama Restaurant & Food Documents:\n";
      context.forEach((doc, index) => {
        const similarityInfo = doc.similarity ? ` (Relevance: ${(doc.similarity * 100).toFixed(1)}%)` : "";
        const contentPreview = truncateText(doc.content, 500);
        contextText += `\n${index + 1}. ${doc.title}${similarityInfo}\n${contentPreview}\n`;
      });
    }

    const systemPrompt = `
You are Smart Hotel & Food Assistant for Adama city.
Help users find hotels and restaurants in Adama.
Keep answers short (max 5 lines).
`;

    const fullPrompt = `${systemPrompt}${contextText}\n\nUser Question: ${question}\n\nHotel Assistant Response:`;
    
    // Fix: Added the mandatory role property to the content object to avoid TS error
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
    });

    const responseText = result.response.text();
    console.log("✅ AI response generated successfully");
    return responseText;

  } catch (error: any) {
    console.error(`❌ Error generating AI response with ${GEMINI_MODEL}:`, error.message);
    
    // Fallback if context exists
    if (context.length > 0) {
      return {
        text: "I'm having some trouble connecting to my brain, but based on our records: " + context[0].content.substring(0, 150) + "...",
        sources: context.map(doc => ({ id: doc._id, title: doc.title, similarity: doc.similarity }))
      };
    }

    return "I'm having trouble processing your request right now. Please try again later!";
  }
};
