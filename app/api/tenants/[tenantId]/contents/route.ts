import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { tenantId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { tenantId } = params;

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

