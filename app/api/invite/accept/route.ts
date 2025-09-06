import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { token } = await req.json();

  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite) return new Response("Invalid token", { status: 400 });


  await prisma.userTenant.create({
    data: {
      userId: session.user.id,
      tenantId: invite.tenantId,
      role: invite.role,
    },
  });

  // Delete invite after use
  await prisma.invite.delete({ where: { id: invite.id } });

  return new Response("Joined tenant successfully");
}

