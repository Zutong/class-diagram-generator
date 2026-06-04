import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, errorFallback, previousCode } = body;

    // ---------------------------------------------------------
    // IMPORTANT: In production, configure your LLM API Key in .env.local
    // e.g., OPENAI_API_KEY=sk-... 
    // const apiKey = process.env.OPENAI_API_KEY;
    // ---------------------------------------------------------

    let systemMessage = `
    You are an expert software architect and Mermaid.js diagram specialist.
    Your task is to convert the user's natural language or source code into a valid Mermaid.js class diagram.
    
    Rules:
    1. Only use standard Mermaid.js classDiagram syntax.
    2. DO NOT output any markdown blocks (like \`\`\`mermaid or \`\`\`).
    3. DO NOT output any explanation text. Just the raw Mermaid code.
    `;

    // Handle Fallback (Self-Correction) if the frontend throws a render error
    let userMessage = prompt;
    if (errorFallback && previousCode) {
      userMessage = `
        The previous Mermaid code you generated had a syntax error:
        ---
        ${previousCode}
        ---
        Error details: ${errorFallback}
        
        Please FIX the code and output ONLY the corrected Mermaid class diagram code.
      `;
    }

    // Handles integration with DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.1, // Keep it low for strict syntax generation
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      console.error("DeepSeek API Error:", await response.text());
      return NextResponse.json({ error: "Failed to fetch from LLM API" }, { status: response.status });
    }

    const data = await response.json();
    let aiCode = data.choices[0].message.content.trim();

    // Sometimes LLMs (even with strong prompt) wrap code in markdown blocks. Strip them.
    if (aiCode.startsWith("\`\`\`mermaid")) {
      aiCode = aiCode.replace(/^\`\`\`mermaid\n?/, "").replace(/\n?\`\`\`$/, "");
    } else if (aiCode.startsWith("\`\`\`")) {
      aiCode = aiCode.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
    }

    return NextResponse.json({ code: aiCode });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}