import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ✅ Consistent typing for route params
type RouteParams<T extends string> = { params: Record<T, string> };

// Example DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;

  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) return new Response("Not found", { status: 404 });

  // ... your logic here

  return new Response(JSON.stringify({ success: true }));
}

// Example PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
 
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;
  const body = await req.json();
  const { platform, text } = body as { platform: string; text: string };

  if (!platform || !text) {
    return new Response("Missing platform or text", { status: 400 });
  }

  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) return new Response("Not found", { status: 404 });

  // ... your update logic

  return new Response(JSON.stringify(content));
}
