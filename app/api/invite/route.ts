import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { email, tenantId, role } = await req.json();

  if (!email || !tenantId || !role)
    return new Response("Missing fields", { status: 400 });

  // Only ADMIN can invite
  const userTenant = await prisma.userTenant.findFirst({
    where: { userId: session.user.id, tenantId, role: "ADMIN" },
  });
  if (!userTenant) return new Response("Forbidden", { status: 403 });

  const token = randomUUID();
  const invite = await prisma.invite.create({
    data: { email, tenantId, role, token },
  });

  // send email with link like: /accept-invite?token=xxxx
  return new Response(JSON.stringify(invite));
}

