import { prisma } from "@/lib/prisma";
import { requireUserInTenant } from "@/lib/authorize";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function parseOutput(output: string) {
  const facebookMatch = output.match(/\[FACEBOOK\]([\s\S]*?)\[TWITTER\]/);
  const twitterMatch = output.match(/\[TWITTER\]([\s\S]*?)\[LINKEDIN\]/);
  const linkedinMatch = output.match(/\[LINKEDIN\]([\s\S]*)/);

  return {
    facebook: facebookMatch ? facebookMatch[1].trim() : "",
    twitter: twitterMatch ? twitterMatch[1].trim() : "",
    linkedin: linkedinMatch ? linkedinMatch[1].trim() : "",
  };
}

export async function POST(req: Request) {
  const { tenantId, blogText } = await req.json();

  if (!tenantId || !blogText)
    return new Response("Missing fields", { status: 400 });

  try {
    // ✅ Enforce tenant + role access
    await requireUserInTenant(req, tenantId, ["ADMIN", "EDITOR"]);

    // ✅ Structured prompt for exactly 1 post per platform
    const prompt = `
You are a content repurposing assistant.
Take the following blog and generate EXACTLY ONE short piece of content for each platform in this format:

[FACEBOOK]
<One friendly Facebook post (2-4 sentences, casual + engaging)>

[TWITTER]
<One concise tweet under 280 characters, punchy style>

[LINKEDIN]
<One professional LinkedIn post (2-4 sentences, business tone)>

Blog: ${blogText}
`;

    // ✅ Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    // ✅ Extract structured content
    const parsed = parseOutput(output);

    // ✅ Save structured content
    const content = await prisma.content.create({
      data: {
        tenantId,
        inputText: blogText,
        outputs: parsed,
      },
    });

    return new Response(JSON.stringify(content));
  } catch (err: any) {
    console.error("Gemini API error:", err);
    const status =
      err.message?.includes("Unauthorized") || err.message?.includes("Forbidden")
        ? 403
        : 500;
    return new Response(err.message || "AI generation failed", { status });
  }
}
