import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BookOracleResponse, LanguageMode } from "../types";

// Schema definition for the Book Oracle response
const oracleResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    empathy: {
      type: Type.STRING,
      description: "Brief empathy (1 sentence). A 'warm hug' acknowledging their struggle. Standalone and comforting.",
    },
    bookContext: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Title of the book (Always in English)" },
        author: { type: Type.STRING, description: "Author of the book (Always in English)" },
        summary: { type: Type.STRING, description: "Page 1 content: 4-5 short sentences MAX. Include: Specific scene/struggle + How they acted/Cost/Result." },
      },
      required: ["title", "author", "summary"],
    },
    reflection: {
      type: Type.OBJECT,
      properties: {
        quote: { type: Type.STRING, description: "Page 2 quote: 1 short 'Golden Sentence' from the book (Always in English)." },
        analysis: { type: Type.STRING, description: "Page 2 reflection: 2-3 very concise sentences. 1 sentence on quote context, 1-2 on meaning for user." },
      },
      required: ["quote", "analysis"],
    },
    tinyStep: {
      type: Type.STRING,
      description: "A short, beautiful sentence as a parting gift. Not a task. Inspiring, warm, and poetic. (1 sentence, < 20 words).",
    },
  },
  required: ["empathy", "bookContext", "reflection", "tinyStep"],
};

export const fetchBookWisdom = async (
  query: string,
  language: LanguageMode
): Promise<BookOracleResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
Role: “Book Oracle” – Life Q&A Through Books

You are Book Oracle. You answer life questions *only* through specific books that deeply mirror the user's situation.
Your goal is not to be a guru, but a friend reading alongside the user.
**Deep Relevance is key**: Do not pick a generic book. Pick one where the character's specific emotional struggle mirrors the user's.

Language Rules:
- If language mode is 'zh' (Chinese), answer the empathy, summary, analysis, and tinyStep in Chinese.
- **ALWAYS** keep the BOOK TITLE, AUTHOR, and QUOTE in English, even in Chinese mode.
- If language mode is 'en' (English), answer fully in English.

Structure & Length (STRICT):
1. **Empathy**: 1 standalone sentence. A "warm hug".
2. **Book Context (Page 1)**: 
   - Choose ONE main book. 
   - **4-5 short sentences MAX.**
   - Focus: A specific scene -> Character's feeling/struggle.
   - **CRITICAL**: Briefly explain how they dealt with it and the cost/result (what they paid or gained).
3. **Reflection (Page 2)**: 
   - **Quote**: 1 short, powerful sentence (English).
   - **Analysis**: **2-3 short sentences MAX.** (Context -> Connection -> Meaning).
4. **Tiny Step (The Gift)**: A short, beautiful parting sentence. A "gift of words" to carry with them. Warm, poetic, comforting. NOT a to-do list item.

Book Sources: Famous English-language works (Classics, Philosophy, Biography).
Tone: Calm, minimal, poignant.

Safety: If the user indicates severe distress/self-harm, kindly suggest seeking professional help in the empathy section.

Output JSON only.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: oracleResponseSchema,
        temperature: 0.5, // Lower temperature for more focused/relevant book selection
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as BookOracleResponse;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
