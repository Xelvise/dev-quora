import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(payload: Request) {
    try {
        // Parse the request body
        const { title, content } = await payload.json();

        // Validate the request body
        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
        }

        // Ensure the API key is available
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_APIKEY;
        if (!apiKey) {
            console.error("Missing API key for GoogleGenAI.");
            return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
        }

        // Initialize the GoogleGenAI client
        const { models } = new GoogleGenAI({ apiKey });

        // Generate content using the AI model
        const response = await models.generateContent({
            model: "gemini-2.0-flash",
            contents: content,
            config: {
                systemInstruction: `${title} \n Do not apply any formatting to your response. Just provide your response in plain text.`,
                maxOutputTokens: 200,
            },
        });

        // Return the generated content
        return NextResponse.json({ message: response.text });
    } catch (error: any) {
        console.error("Error generating AI content:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
