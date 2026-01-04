
import { GoogleGenAI, Type } from "@google/genai";

export const extractProductDetails = async (base64Image) => {
  const apiKey = import.meta.env.VITE_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing VITE_API_KEY environment variable. Add it to a .env file or your environment.');
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: [
      {
        parts: [
          {
            text: "Extract the following details from this product image. Be precise. If a field is not visible, return 'Not found'.",
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: {
            type: Type.STRING,
            description: "The name of the product or brand.",
          },
          batchNumber: {
            type: Type.STRING,
            description: "The batch code or lot number.",
          },
          expiryDate: {
            type: Type.STRING,
            description: "The expiration date (EXP) found on the product.",
          },
          quantity: {
            type: Type.STRING,
            description: "The weight, volume, or count (e.g., 500g, 10 pieces).",
          },
          category: {
            type: Type.STRING,
            description: "The category of the product (e.g., Food, Medicine, Cosmetics, Electronics).",
          },
          description: {
            type: Type.STRING,
            description: "A brief description of the product or its ingredients/usage.",
          },
        },
        required: ["productName", "batchNumber", "expiryDate", "quantity", "category"],
      },
    },
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse AI response. Please try again with a clearer photo.");
  }
};
