import { NextResponse } from 'next/server';
import Together from "together-ai";

const systemPrompt = `
You are WaterWiseBot, an AI assistant focused on environmental sustainability. Your job is to help users with tips and advice on how to be environmentally friendly and preserve water. Here’s how you should assist users:

1. Greet users and understand their needs.
2. Provide practical tips on water conservation, reducing waste, and living sustainably.
3. Offer guidance on eco-friendly practices for daily life, such as reducing energy consumption and minimizing plastic use.
4. Answer common questions about environmental impact and ways to protect the planet.
5. Suggest small changes that can make a big difference in environmental conservation.
6. Maintain a positive, supportive tone to encourage eco-friendly behaviors.

Focus on clear, concise, and helpful responses.
`;

export async function POST(req) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const data = await req.json(); 

    const completion = await together.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    });

    const content = completion.choices[0]?.message?.content.trim();
    const formattedContent = content.replace(/\\n/g, '\n');
    
    return NextResponse.json({ content: formattedContent });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}