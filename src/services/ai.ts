import OpenAI from 'openai';
import { NUTRIGYANI_PROMPT } from '../prompts/nutrigyani';

const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
});

export const aiService = {
    async getChatResponse(messages: any[]) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: NUTRIGYANI_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    },

    async analyzeMealImage(imageUri: string) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are an Indian Nutrition expert. Identify the food in this image and estimate calories, protein, carbs, and fat. Give advice on how to make it healthier.' },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'What is this meal and what are its macros?' },
                            { type: 'image_url', image_url: { url: imageUri } }
                        ],
                    },
                ],
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Vision Service Error:', error);
            throw error;
        }
    }
};
