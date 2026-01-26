import { GoogleGenerativeAI } from "@google/generative-ai";
import { list } from '../services/product.service';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProductType } from "../types/product.types";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export const getSmartRecommendations = async (userQuery: string, skip: number = 0, limit: number = 10) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const { data: products, totalCount } = await list(skip, limit, {}, ['category', 'brand']);

    if (!products || products.length === 0) {
      return { data: [], totalCount: 0 };
    }

    // Format products for the prompt
    const productContext = products.map((p: any) => `
      ID: ${p._id}
      Name: ${p.name}
      Brand: ${p.brand?.name || 'Unknown'} 
      Notes: ${JSON.stringify(p.notes)}
      Description: ${p.description.substring(0, 100)}...
    `).join('\n---\n');

    // Construct Prompt
    const prompt = `
      You are an expert Perfume Sommelier.
      User Query: "${userQuery}"

      Here is our Product Catalog:
      ${productContext}

      Task: Recommend up to ${limit} perfumes from the catalog that best match the user's query.
      Rules:
      - Return ONLY a JSON array of objects.
      - Schema: [{ "id": "PRODUCT_ID", "reason": "Short reason why" }]
      - Order the results by relevance (best match first).
      - If no match found, returns []
      - Be creative but accurate based on the "Notes" and "Description".
    `;

    // Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and Parse Response
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let recommendations = [];
    try {
      recommendations = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      // Fallback or retry could go here
      return { data: [], totalCount };
    }

    if (!Array.isArray(recommendations)) {
      console.warn("AI did not return an array");
      return { data: [], totalCount };
    }

    // fetch with specific IDs
    const validIds = recommendations
      .filter((r: any) => mongoose.Types.ObjectId.isValid(r.id))
      .map((r: any) => new mongoose.Types.ObjectId(r.id));

    if (validIds.length === 0) {
      return { data: [], totalCount };
    }

    // fetch with specific IDs
    const { data: fullProducts } = await list(null, null, { _id: { $in: validIds } }, ['category', 'brand']);

    // merge reason with full product details
    const finalResults = fullProducts.map((product: ProductType) => {
      const rec = recommendations.find((recommendation: any) => recommendation.id === product._id.toString());
      return {
        ...product,
        recommendation_reason: rec?.reason
      };
    });

    return { data: finalResults, totalCount };

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

