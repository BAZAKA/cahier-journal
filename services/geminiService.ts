
import { GoogleGenAI, Type } from "@google/genai";
import type { Activity } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you would handle this more gracefully.
  // For this context, we assume the key is available.
  console.warn("API_KEY environment variable not set. Gemini API features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateActivityIdeas = async (topic: string, skill: string, level: string): Promise<Omit<Activity, 'id'>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `En tant qu'expert en enseignement du FLE, génère 3 idées d'activités créatives pour une classe de niveau ${level} sur le thème "${topic}" en se concentrant sur la compétence "${skill}". Pour chaque activité, fournis un titre, une brève description et une durée estimée en minutes. Réponds uniquement avec le JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.NUMBER },
              type: { type: Type.STRING },
            },
            required: ["title", "description", "duration", "type"],
          },
        },
      },
    });

    const jsonString = response.text;
    const ideas = JSON.parse(jsonString);
    return ideas as Omit<Activity, 'id'>[];
  } catch (error) {
    console.error("Error generating activity ideas:", error);
    throw new Error("Failed to generate activity ideas from Gemini API.");
  }
};
