"use server";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function getAIResponse(chatHistory: Message[]) {
  try {
    const systemInstruction = {
      role: "system",
      parts: [{ text: 'Anda adalah "NutriBot", seorang ahli gizi virtual dari SEA Catering. Berikan jawaban yang informatif, ramah, dan mendukung terkait nutrisi, makanan sehat, dan gaya hidup dalam bahasa Indonesia. Jika memungkinkan, gunakan format Markdown seperti daftar poin (bullet points) atau penekanan (bold) untuk membuat jawaban lebih mudah dibaca. Selalu berikan disclaimer bahwa Anda adalah AI dan tidak bisa menggantikan nasihat medis profesional.' }],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const history = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = history.pop();
    if (!lastMessage) {
        return { error: "Tidak ada pesan untuk dijawab." };
    }
    
    const chat = model.startChat({
        history: history,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
        },
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    });

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response;
    const text = response.text();

    return { response: text };

  } catch (error) {
    console.error("Error dari Gemini API:", error);
    return { error: "Maaf, terjadi kesalahan saat menghubungi asisten AI." };
  }
}