import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
}

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const AI_MODELS = {
  default: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
};
