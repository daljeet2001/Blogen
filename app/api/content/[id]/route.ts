import { prisma } from "@/lib/prisma";
import { requireUserInTenant } from "@/lib/authorize";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;

  // Find content first (to get tenantId)
  const content = await prisma.content.findUnique({
    where: { id },
  });
  if (!content) return new Response("Not found", { status: 404 });

  // ✅ Enforce tenant + role access
    await requireUserInTenant(req, content.tenantId, ["ADMIN"]);

  // Delete content
  await prisma.content.delete({
    where: { id },
  });

  return new Response(JSON.stringify({ success: true }));
}




export async function PUT(
  req: Request,
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

  const userTenant = await prisma.userTenant.findFirst({
    where: { tenantId: content.tenantId, userId: session.user.id },
  });
  if (!userTenant) return new Response("Forbidden", { status: 403 });

  if (!["ADMIN", "EDITOR"].includes(userTenant.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  type Outputs = Record<string, string>;
  const currentOutputs = (content.outputs || {}) as Outputs;

  const updated = await prisma.content.update({
    where: { id },
    data: {
      outputs: {
        ...currentOutputs,
        [platform]: text,
      },
    },
  });

  return new Response(JSON.stringify(updated));
}

