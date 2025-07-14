import { GoogleGenAI, Modality } from '@google/genai';

const MODEL_NAME = 'gemini-2.0-flash';
const IMAGE_MODEL_NAME = 'gemini-2.0-flash-exp-image-generation';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error('Missing Gemini API key. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenAI({ apiKey });

function toGenAIContents(messages: { role: string; content: string }[]) {
  return messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));
}

export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
  try {
    console.log('Gemini API call', messages);
    const contents = toGenAIContents(messages);

    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }
    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return `Gemini API Error: ${error.message || error}`;
  }
}

/**
 * Generates an image (and optional text) from a prompt.
 * @param prompt The text prompt describing the desired image.
 * @returns An object containing `text` output and `imageUri` as a data URI.
 */
export async function generateImage(prompt: string): Promise<{ text: string; imageUri: string }> {
  try {
    const response = await genAI.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Handle image safety block
    if (
      response &&
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].finishReason === "IMAGE_SAFETY"
    ) {
      return {
        text: "Sorry, your prompt was flagged by image safety filters and cannot be generated.",
        imageUri: ""
      };
    }

    if (!response || !response.candidates || response.candidates.length === 0) {
      return { text: 'Unable to generate this type of image', imageUri: ''};
    }

    const parts = response.candidates?.[0]?.content?.parts || [];
    let textOutput = '';
    let base64Data = '';

    for (const part of parts) {
      if (part.text) {
        textOutput += part.text;
      } else if (part.inlineData?.data) {
        base64Data = part.inlineData.data;
      }
    }

    const imageUri = `data:image/png;base64,${base64Data}`;
    return { text: 'Here is your generated image.', imageUri };
  } catch (error: any) {
    console.error('Image generation error:', error);
    throw error;
  }
}
