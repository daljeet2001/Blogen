import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { name } = await req.json();

  if (!name) return new Response("Tenant name is required", { status: 400 });

  const tenant = await prisma.tenant.create({ data: { name } });

if (!session?.user?.id) {
  throw new Error("Unauthorized: No valid session found");
}

await prisma.userTenant.create({
  data: { userId: session.user.id, tenantId: tenant.id, role: "ADMIN" },
});

  return new Response(JSON.stringify(tenant));
}

