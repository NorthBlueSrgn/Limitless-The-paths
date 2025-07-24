// app/api/chapter-black/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure to set this in .env.local
});

export async function POST(req) {
  const { paths, rank, lastChapterSummary } = await req.json();

  const prompt = `
You are writing a manga called Chapter Black. This story adapts to the user's journey and is continuous, not random. The user is currently rank ${rank} and following these paths: ${paths.join(", ")}. 
Their last chapter summary was: "${lastChapterSummary || "None"}".

Write today's chapter. Tone: seinen, immersive, suspenseful. Include world-building and subtle metaphors tied to their goals.
End with a mysterious line or question. Write like it’s a real manga episode.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const story = response.choices[0].message.content;

  return NextResponse.json({ story });
}
