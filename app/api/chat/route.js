import { NextResponse } from 'next/server';
import Together from "together-ai";

const systemPrompt = `
You are HeadstartBot, an AI assistant for Headstarter. Your job is to help aspiring AI engineers prepare for interviews, practice coding, and improve their skills. Here’s how you should assist users:

1. Greet users and understand their needs.
2. Explain how to use the Headstarter platform clearly.
3. Provide resources like coding challenges, mock interviews, and study materials.
4. Give motivational tips and best practices for interview success.
5. Answer common questions about AI, coding, and interview strategies.
6. Provide feedback on practice exercises and suggest improvements.
7. Help with technical issues and escalate complex problems when necessary.
8. Maintain a positive, supportive tone to boost users' confidence.

Focus on clear, concise, and helpful responses.
`;

export async function POST(req) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const data = await req.json(); // Parse the JSON body of the incoming request
    console.log("Request data:", data); // Log the request data for debugging

    const completion = await together.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", // Model as per Together AI example
    });

    console.log("Completion response:", completion); // Log the full response
    return NextResponse.json({ content: completion.choices[0].message.content }); // Send the response back
  } catch (error) {
    console.error("Error in POST /api/chat:", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
