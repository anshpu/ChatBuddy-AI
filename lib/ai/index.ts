import { AI_PROVIDER } from './config';
import { sendMessage as sendGemini } from './gemini';
import { generateImage as imageGemini } from './gemini';

export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
    switch (AI_PROVIDER) {
        case 'gemini':
            return await sendGemini(messages);
        default:
            throw new Error('Unsupported AI provider');
    }
}

export async function generateImage(prompt: string): Promise<{ text: string; imageUri: string }> {
    switch (AI_PROVIDER) {
        case 'gemini':
            return await imageGemini(prompt);
        default:
            throw new Error('Unsupported AI provider');
    }
}