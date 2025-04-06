import { NextResponse } from "next/server";

export async function POST(payload: Request) {
    const question = await payload.json();
    try {
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    } finally {
    }
}

// const { question, answer } = await req.json();
// const response = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [
//             { role: "user", content: `Answer the question "${question}" in a detailed manner` },
//             { role: "assistant", content: answer },
//         ],
//     }),
// });

// if (!response.ok) throw new Error("Failed to fetch data from OpenAI");

// const data = await response.json();
// return new Response(JSON.stringify(data), { status: 200 });
