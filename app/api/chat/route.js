import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openaiApiKey = process.enxv.local.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error('API key is not defined');
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

const systemPrompt = "Your system prompt goes here";

export async function POST(req) {
  const data = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data.messages],
      model: 'gpt-4',
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('API request error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
