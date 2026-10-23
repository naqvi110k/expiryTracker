const { GoogleGenerativeAI } = require('@google/generative-ai');

const extractProductDetails = async (base64Image, mimeType = 'image/jpeg') => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable. Add it to your .env file.');
  }

  const sanitizedKey = apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : 'None';
  console.log('Active Gemini API Key:', sanitizedKey);

  const genAI = new GoogleGenerativeAI(apiKey);

  // Note: Match the frontend model that is working fine
  const modelName = 'gemini-2.5-flash-lite';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = "Extract the following details from this product image. Look specifically for ink-jet printed expiry dates, batch codes, and product names. If a field is not visible, return 'Not found'. Return ONLY a valid JSON object with these fields: productName, batchNumber, expiryDate, quantity, category, description.";

  const image = {
    inlineData: {
      data: base64Image.includes(',') ? base64Image.split(',')[1] : base64Image,
      mimeType: mimeType
    }
  };

  try {
    console.log(`Sending image to Gemini (${modelName}) for analysis...`);
    const result = await model.generateContent([prompt, image]);
    const response = result.response;

    // Check if the response was blocked by safety filters
    if (response.promptFeedback && response.promptFeedback.blockReason) {
      throw new Error(`AI blocked the request: ${response.promptFeedback.blockReason}`);
    }

    const text = response.text() || "{}";
    console.log('Gemini raw response:', text);

    try {
      // Direct parse if possible, or extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonToParse = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonToParse);
    } catch (e) {
      console.error('JSON parse error from Gemini text:', text);
      throw new Error("AI returned invalid data format. Please try again with a clearer photo.");
    }
  } catch (error) {
    console.error('Error with Gemini API:', error);

    // Handle specific error codes
    const errMsg = String(error?.message || '');
    if (errMsg.includes('429')) {
      throw new Error("Quota Exceeded (429). The API key has reached its limit. Please check your billing/usage in Google AI Studio.");
    }

    if (errMsg.includes('404')) {
      throw new Error(`Model ${modelName} not found. Please check if your key has access to this model.`);
    }

    throw new Error(errMsg || 'An unknown error occurred with the Gemini API.');
  }
};

const correctProductDetails = async (currentDetails, correctionText) => {
  const apiKey = process.env.VITE_API_KEY || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing API key for corrections.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite', // Using the model name that was working fine for the user
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    You are an assistant for an expiry tracker app.
    The user wants to correct some product details.
    
    Current details: ${JSON.stringify(currentDetails)}
    User correction: "${correctionText}"
    
    Apply the user's correction to the current details and return the updated JSON.
    If the user mentions a specific field (like "Name is Milk" or "Quantity 10"), update that field.
    If the user's text is vague but implies a correction, do your best to interpret it.
    
    Return ONLY a valid JSON object with these fields: productName, batchNumber, expiryDate, quantity, category, description.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text() || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonToParse = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonToParse);
  } catch (error) {
    console.error('Error with Gemini correction:', error);
    throw new Error("Failed to process your correction. Please try being more specific.");
  }
};

module.exports = {
  extractProductDetails,
  correctProductDetails
};