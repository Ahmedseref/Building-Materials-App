import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Edits an image using the Gemini 2.5 Flash Image model (Nano banana).
 * @param base64Image The source image in base64 format (no data URI prefix preferred, or strip it).
 * @param prompt The user's instruction for editing/generating.
 * @returns The generated image in base64 format.
 */
export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!apiKey) {
    console.error("API Key is missing.");
    throw new Error("API Key is missing");
  }

  try {
    // Strip header if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Act as a professional architectural visualization tool. 
            Modify this product image based on the following instruction: "${prompt}".
            Keep the main product recognizable but apply the requested context, style, or modification.
            Return ONLY the image.`
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          }
        ]
      }
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/jpeg;base64,${part.inlineData.data}`;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Helper to convert URL to Base64 (to feed into Gemini)
 */
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};