import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } } 
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { tenantId } = params;

  // Ensure user belongs to tenant
  const userTenant = await prisma.userTenant.findFirst({
    where: { tenantId, userId: session.user.id },
  });
  if (!userTenant) return new Response("Forbidden", { status: 403 });

  const members = await prisma.userTenant.findMany({
    where: { tenantId },
    include: { user: true },
  });

  return new Response(JSON.stringify(members), {
    headers: { "Content-Type": "application/json" },
  });
}
