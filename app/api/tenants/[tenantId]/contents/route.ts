import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
 context: any) {
  const { tenantId } = context.params; 
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userTenant = await prisma.userTenant.findFirst({
    where: { tenantId, userId: session.user.id },
  });
  if (!userTenant) return new Response("Forbidden", { status: 403 });

  const contents = await prisma.content.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(contents));
}
