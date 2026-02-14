import { Response } from "express";
import axios, { AxiosResponse } from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DocumentModel, { IDocument } from "../models/Document";
import { IAuthRequest } from "../types";
import {
  chunkText,
  cleanText,
  extractTextFromFile,
  truncateText,
} from "../utils/textProcessing";

/**
 * Voyage AI API response structure
 */
interface VoyageEmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

/**
 * Initialize Google Gemini AI with 2.0 Flash
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Model names
const VOYAGE_MODEL = "voyage-3-large"; // 1024 dimensions
const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Generate text embeddings using Google Gemini text-embedding-004 model
 * @param {string} text - Text to embed
 * @returns {Promise<number[] | null>} Embedding vector (1536 dimensions)
 */
const generateEmbedding = async (text: string): Promise<number[] | null> => {
  try {
    if (!text || text.trim().length === 0) return null;

    console.log(`🔢 Generating embedding with Gemini text-embedding-004...`);
    console.log("   Text preview:", truncateText(text, 80));

    // Get embedding model
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // Generate embedding with specific output dimensionality (1536)
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      taskType: "retrieval_document" as any,
      outputDimensionality: 1536,
    });

    const embedding = result.embedding.values;

    if (embedding && embedding.length > 0) {
      console.log(
        `✅ Embedding generated successfully (${embedding.length} dimensions)`,
      );
      return Array.from(embedding);
    }

    throw new Error("Empty embedding returned from Gemini");
  } catch (error) {
    const err = error as any;
    console.error("❌ Error generating embedding with Gemini:", err.message);
    return null;
  }
};

/**
 * Find relevant documents using vector similarity search
 * @param {number[]} queryEmbedding - Query embedding vector
 * @param {number} limit - Max documents to return
 * @returns {Promise<Array<IDocument & { similarity: number }>>} Relevant documents with similarity scores
 */
const findRelevantDocumentsByEmbedding = async (
  queryEmbedding: number[],
  limit: number = 3,
): Promise<Array<IDocument & { similarity: number }>> => {
  try {
    console.log("🔍 Searching relevant documents using Atlas Vector Search...");

    // Use native Atlas Vector Search method
    const results = await DocumentModel.vectorSearch(queryEmbedding, limit);

    console.log(`✅ Found ${results.length} relevant documents via Atlas`);
    results.forEach((doc, idx) => {
      console.log(
        `   ${idx + 1}. "${doc.title}" (score: ${doc.similarity.toFixed(3)})`,
      );
    });

    return results;
  } catch (error) {
    console.error("❌ Error in findRelevantDocumentsByEmbedding:", error);
    return [];
  }
};

/**
 * Find relevant documents for RAG (fallback to text search if no embedding provided)
 * @param {string} query - User query
 * @param {number} limit - Max documents to return
 * @returns {Promise<IDocument[]>} Relevant documents
 */
const findRelevantDocuments = async (
  query: string,
  limit: number = 3,
): Promise<IDocument[]> => {
  try {
    console.log(
      "🔍 Searching for relevant documents (text search fallback)...",
    );

    // Try to use text search
    const documents = await DocumentModel.findSimilar(query, limit);

    if (documents && documents.length > 0) {
      console.log(`✅ Found ${documents.length} relevant documents`);
      return documents;
    }

    console.log("ℹ️  No relevant documents found");
    return [];
  } catch (error) {
    console.error("❌ Error finding relevant documents:", error);
    return [];
  }
};

/**
 * Generate AI response using Google Gemini 2.0 Flash
 * @param {string} question - User question
 * @param {Array} context - Relevant documents for context
 * @returns {Promise<string>} AI response
 */
type AIResult =
  | string
  | {
      text: string;
      sources?: Array<{ id: string; title: string; similarity?: number }>;
    };

const generateAIResponse = async (
  question: string,
  context: Array<IDocument & { similarity?: number }> = [],
): Promise<AIResult> => {
  try {
    console.log(`🤖 Generating AI response with ${GEMINI_MODEL}...`);

    // Initialize Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Build context from documents
    let contextText = "";
    if (context.length > 0) {
      contextText =
        "\n\nRelevant Information from Adama Restaurant & Food Documents:\n";
      context.forEach((doc, index) => {
        const similarityInfo = doc.similarity
          ? ` (Relevance: ${(doc.similarity * 100).toFixed(1)}%)`
          : "";
        const contentPreview = truncateText(doc.content, 500);
        contextText += `\n${index + 1}. ${doc.title}${similarityInfo}\n${contentPreview}\n`;
      });
    }

    // System prompt for Adama Hotel assistant
    const systemPrompt = `
You are Smart Hotel & Food Assistant for Adama city.

IMPORTANT RULES:
- You are NOT ChatGPT.
- You are NOT OpenAI.
- You are NOT Google AI.
- You are Smart Hotel & Food Assistant.

Your job:
- Help users find hotels in Adama
- Help users find restaurants and food services
- Suggest services based only on Adama city
- Keep answers short (maximum 5 lines)
- Be friendly, professional, and helpful

If the user asks:
"Who are you?"
You must answer exactly:
"I am Smart Hotel & Food Assistant. I help you find the best hotels, restaurants, and services in Adama."

If user asks something unrelated:
Politely say:
"I am here to help you with hotels and food services in Adama."

DO NOT:
- Return JSON
- Return database raw text
- Say you are an AI model
- Say you are trained by OpenAI
- Give very long paragraphs
- Make up information outside Adama

Always respond like a real hotel concierge assistant.
`;

    // Combine system prompt, context, and user question
    const fullPrompt = `${systemPrompt}${contextText}\n\nUser Question: ${question}\n\nHotel Assistant Response:`;

    // Generate response (handle different SDK response shapes)
    const result = await model.generateContent(fullPrompt);

    // Some SDKs return the final text via result.response.text() or result.text
    let text = "";
    try {
      if (result && typeof (result as any).text === "function") {
        text = await (result as any).text();
      } else if (result && typeof (result as any).text === "string") {
        text = (result as any).text;
      } else if (
        (result as any).response &&
        typeof (result as any).response.text === "function"
      ) {
        text = await (result as any).response.text();
      } else if (
        (result as any).response &&
        typeof (result as any).response === "string"
      ) {
        text = (result as any).response;
      } else {
        // Fallback: stringify the result
        text = JSON.stringify(result).slice(0, 2000);
      }
    } catch (err) {
      console.warn(
        "Could not extract text from model result, fallback to stringifying result",
        err,
      );
      text = JSON.stringify(result).slice(0, 2000);
    }

    console.log("✅ AI response generated successfully");
    console.log("   Response preview:", truncateText(text, 100));

    return text;
  } catch (error) {
    const err = error as any;
    
    // Check if this is a quota error
    const isQuotaError = err && err.message && (
      err.message.includes("quota") || 
      err.message.includes("429") ||
      err.message.includes("Too Many Requests")
    );

    if (isQuotaError) {
      console.error("⚠️ Gemini API quota exceeded - using fallback response");
    } else {
      console.error("❌ Error generating AI response:", err.message);
    }

    // Extra diagnostics for remote/API errors
    if (err && err.response) {
      try {
        console.error("🔎 Gemini API response status:", err.response.status);
      } catch (loggingErr) {
        console.error("Could not log error response:", loggingErr);
      }
    }

    // If we have RAG context (documents), synthesize a useful answer from them
    try {
      let docsToUse = context;

      if (docsToUse && docsToUse.length > 0) {
        console.log("✅ Synthesizing natural response from semantically retrieved documents...");
        
        // Extract relevant information from documents
        const relevantInfo: string[] = [];
        const sources: Array<{
          id: string;
          title: string;
          similarity?: number;
        }> = [];
        
        for (let i = 0; i < Math.min(docsToUse.length, 3); i++) {
          const doc = docsToUse[i];
          const content = (doc as any).content || "";
          
          // Split content into lines
          const allLines = content.split('\n').filter(line => line.trim().length > 0);
          
          // Take more lines for a richer answer
          const snippet = allLines.slice(0, 15).join('\n');
          if (snippet.trim()) {
            relevantInfo.push(snippet);
          }
          
          sources.push({
            id: doc._id.toString(),
            title: doc.title,
            similarity: doc.similarity,
          });
        }

        // Create a natural, conversational response
        let synthesized = "";
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes("who are you") || lowerQuestion.includes("what are you")) {
          synthesized = "I am Smart Hotel & Food Assistant for Adama city. I help you find the best hotels, restaurants, and services in Adama. How can I assist you today?";
        } else {
          // Use the top relevant document for a clean response
          synthesized = `Based on the information I found:\n\n${relevantInfo[0]}\n\nIs there anything specific you would like me to clarify regarding this?`;
        }

        console.log("✅ Natural response synthesized successfully from embeddings");
        return { text: synthesized, sources };
      }
    } catch (synthErr) {
      console.error(
        "❌ Error while synthesizing fallback from documents:",
        synthErr,
      );
    }

    // Final fallback response when AI service is unavailable and no documents found
    if (isQuotaError) {
      return "I'm currently experiencing high demand. Please try asking about specific hotels, restaurants, or services in Adama, and I'll search our database for you.";
    }
    
    return "I'm having trouble processing your request right now. Please try asking about hotels, restaurants, or services in Adama!";
  }
};

/**
 * @desc    Ask chatbot a question (RAG implementation with vector search)
 * @route   POST /api/chat/ask
 * @access  Private
 */
export const askQuestion = async (
  req: IAuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { question } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    console.log("💬 Chat request from user:", req.user.email);
    console.log("Question:", question);

    // Validate question
    if (!question || question.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Please provide a question",
      });
      return;
    }

    if (question.length > 1000) {
      res.status(400).json({
        success: false,
        message: "Question is too long (max 1000 characters)",
      });
      return;
    }

    // Step 1: Generate embedding for the question
    const queryEmbedding = await generateEmbedding(question);

    let relevantDocs: Array<IDocument & { similarity?: number }> = [];

    // Step 2: Find relevant documents using embedding or fallback to text search
    if (queryEmbedding && queryEmbedding.length > 0) {
      relevantDocs = await findRelevantDocumentsByEmbedding(queryEmbedding, 3);
    } else {
      console.log("⚠️  Falling back to text search (no embedding available)");
      relevantDocs = await findRelevantDocuments(question, 3);
    }

    // Step 3: Generate AI response with context (RAG generation)
    const aiResult = await generateAIResponse(question, relevantDocs);

    // Normalize aiResult to text and structured sources
    let aiText: string;
    let aiSources: Array<{
      id: any;
      title: string;
      category?: string;
      similarity?: number | undefined;
      isChunk?: boolean;
      chunkIndex?: number | undefined;
    }> = [];

    if (typeof aiResult === "string") {
      aiText = aiResult;
      aiSources = relevantDocs.map((doc) => ({
        id: doc._id,
        title: doc.title,
        category: doc.category,
        similarity: doc.similarity,
        isChunk: doc.isChunk,
        chunkIndex: doc.chunkIndex,
      }));
    } else {
      aiText = aiResult.text;
      if (aiResult.sources && aiResult.sources.length > 0) {
        aiSources = aiResult.sources.map((s) => ({
          id: s.id,
          title: s.title,
          category: undefined,
          similarity: s.similarity,
        }));
      } else {
        aiSources = relevantDocs.map((doc) => ({
          id: doc._id,
          title: doc.title,
          category: doc.category,
          similarity: doc.similarity,
          isChunk: doc.isChunk,
          chunkIndex: doc.chunkIndex,
        }));
      }
    }

    // Step 4: Return response
    res.status(200).json({
      success: true,
      data: {
        question,
        answer: aiText,
        sources: aiSources,
        timestamp: new Date(),
      },
    });

    console.log("✅ Chat response sent successfully");
  } catch (error) {
    const err = error as Error;
    console.error("❌ Chat error:", err);
    res.status(500).json({
      success: false,
      message: "Error processing your question",
      error: err.message,
    });
  }
};

/**
 * @desc    Upload document for RAG system (with automatic chunking)
 * @route   POST /api/chat/upload/text
 * @access  Private (Admin only)
 */
/**
 * Helper to process and save documents to the database (handles chunking and embeddings)
 */
const processAndSaveDocument = async (
  title: string,
  content: string,
  userId: string,
  category: string = "other",
  tags: string[] = [],
) => {
  // Clean content
  const cleanedContent = cleanText(content);

  // Determine if chunking is needed (>2000 characters)
  const needsChunking = cleanedContent.length > 2000;

  if (needsChunking) {
    console.log(
      `📑 Document is large (${cleanedContent.length} chars), chunking...`,
    );

    // Create chunks
    const chunks = chunkText(cleanedContent, 1000, 200);
    console.log(`   Created ${chunks.length} chunks`);

    // Create parent document (without embedding, just metadata)
    const parentDoc = await DocumentModel.create({
      title,
      content: cleanedContent,
      category: category || "other",
      tags: tags || [],
      embedding: [], // Parent doesn't have embedding
      uploadedBy: userId,
      isPublic: true,
      isChunk: false,
      chunkCount: chunks.length,
    });

    console.log("✅ Parent document created:", parentDoc._id);

    // Create chunk documents with embeddings
    const chunkPromises = chunks.map(async (chunk, index) => {
      const embedding = await generateEmbedding(chunk.text);

      return DocumentModel.create({
        title: `${title} (Chunk ${index + 1}/${chunks.length})`,
        content: chunk.text,
        category: category || "other",
        tags: tags || [],
        embedding: embedding || [],
        uploadedBy: userId,
        isPublic: true,
        isChunk: true,
        parentDocumentId: parentDoc._id,
        chunkIndex: chunk.index,
        chunkCount: chunks.length,
      });
    });

    await Promise.all(chunkPromises);

    console.log(`✅ All ${chunks.length} chunks created with embeddings`);

    return {
      id: parentDoc._id,
      title: parentDoc.title,
      category: parentDoc.category,
      chunksCreated: chunks.length,
      createdAt: parentDoc.createdAt,
    };
  } else {
    console.log(
      "📄 Document is small, creating single document with embedding...",
    );

    // Generate embedding for the document
    const embedding = await generateEmbedding(cleanedContent);

    // Create single document
    const document = await DocumentModel.create({
      title,
      content: cleanedContent,
      category: category || "other",
      tags: tags || [],
      embedding: embedding || [],
      uploadedBy: userId,
      isPublic: true,
      isChunk: false,
    });

    console.log("✅ Document uploaded successfully:", document.title);

    return {
      id: document._id,
      title: document.title,
      category: document.category,
      createdAt: document.createdAt,
    };
  }
};

/**
 * @desc    Upload document for RAG system (manual text input)
 * @route   POST /api/chat/upload/text
 * @access  Private (Admin only)
 */
export const uploadDocument = async (
  req: IAuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, category, tags } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    console.log("📄 Document upload from user:", req.user.email);

    // Validate input
    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: "Please provide title and content",
      });
      return;
    }

    const result = await processAndSaveDocument(
      title,
      content,
      req.user.id,
      category,
      tags,
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: { document: result },
    });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Document upload error:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading document",
      error: err.message,
    });
  }
};

/**
 * @desc    Upload file for RAG system (PDF/TXT)
 * @route   POST /api/chat/upload/file
 * @access  Private (Admin only)
 */
export const uploadFile = async (
  req: IAuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { category, tags } = req.body;
    const file = req.file;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
      return;
    }

    console.log("📁 File upload from user:", req.user.email);
    console.log(
      `   File name: ${file.originalname}, size: ${file.size} bytes, mimetype: ${file.mimetype}`,
    );

    if (!file.buffer || file.buffer.length === 0) {
      console.error("❌ File buffer is empty!");
      res.status(400).json({
        success: false,
        message: "File buffer is empty",
      });
      return;
    }

    console.log(`📄 Extracting text from ${file.mimetype}...`);
    
    // Extract text from file
    const content = await extractTextFromFile(
      file.buffer,
      file.mimetype || file.originalname,
    );

    console.log(`✅ Text extracted: ${content.length} characters`);
    console.log(`   Preview: ${content.substring(0, 200)}...`);

    if (!content || content.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Could not extract text from the uploaded file",
      });
      return;
    }

    if (content.trim().length < 50) {
      console.warn("⚠️ Extracted content is very short, might be an issue");
    }

    // Use original filename as title if not provided
    const title = req.body.title || file.originalname;

    console.log(`💾 Saving document: "${title}"`);
    console.log(`   Content length: ${content.length} characters`);
    console.log(`   Category: ${category || 'other'}`);

    const result = await processAndSaveDocument(
      title,
      content,
      req.user.id,
      category,
      tags,
    );

    res.status(201).json({
      success: true,
      message: "File uploaded and processed successfully",
      data: { document: result },
    });
  } catch (error: any) {
    console.error("❌ File upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing uploaded file",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all documents
 * @route   GET /api/chat/documents
 * @access  Private
 */
export const getDocuments = async (
  req: IAuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      category,
      search,
      limit = "20",
      page = "1",
      includeChunks = "false",
    } = req.query;

    console.log("📚 Fetching documents...");

    // Build query - exclude chunks by default
    const query: any = {
      isPublic: true,
      isChunk: includeChunks === "true" ? undefined : false,
    };

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search as string };
    }

    // Parse pagination params
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);

    // Execute query with pagination
    const documents = await DocumentModel.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await DocumentModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        documents,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Get documents error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching documents",
      error: err.message,
    });
  }
};

/**
 * @desc    Delete document and its chunks
 * @route   DELETE /api/chat/documents/:id
 * @access  Private (Admin only)
 */
export const deleteDocument = async (
  req: IAuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    console.log("🗑️  Deleting document:", id);

    // Find the document
    const document = await DocumentModel.findById(id);

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    // If it's a parent document, delete all chunks
    if (!document.isChunk && document.chunkCount && document.chunkCount > 0) {
      const deleteResult = await DocumentModel.deleteMany({
        parentDocumentId: id,
      });
      console.log(`   Deleted ${deleteResult.deletedCount} chunks`);
    }

    await document.deleteOne();

    console.log("✅ Document deleted successfully");

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Delete document error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting document",
      error: err.message,
    });
  }
};
