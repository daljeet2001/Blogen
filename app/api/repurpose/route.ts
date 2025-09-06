import { prisma } from "@/lib/prisma";
import { requireUserInTenant } from "@/lib/authorize";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { tenantId, title, blogText } = await req.json();

  if (!tenantId || !title || !blogText)
    return new Response("Missing fields", { status: 400 });

  try {
    // Enforce tenant + role access
    await requireUserInTenant(req, tenantId, ["ADMIN", "EDITOR"]);

    const prompt = `
You are a content repurposing assistant.
Take the following blog and generate:
1. LinkedIn post
2. Twitter thread (3 tweets)
3. Newsletter draft

Blog: ${blogText}
`;

    // Generate content using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    // Save to DB
    const content = await prisma.content.create({
      data: {
        tenantId,
        title,
        inputText: blogText,
        outputs: { text: output },
      },
    });

    return new Response(JSON.stringify(content));
  } catch (err: any) {
    console.error("Gemini API error:", err);
    const status = err.message?.includes("Unauthorized") || err.message?.includes("Forbidden") ? 403 : 500;
    return new Response(err.message || "AI generation failed", { status });
  }
}

