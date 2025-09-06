import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { requireUserInTenant } from "@/lib/authorize";

export async function POST(req: Request) {
  const { email, tenantId, role } = await req.json();

  if (!email || !tenantId || !role)
    return new Response("Missing fields", { status: 400 });

  try {
    // ✅ Enforce tenant + role access (only ADMIN)
    await requireUserInTenant(req, tenantId, ["ADMIN"]);

    // ✅ Check if email already belongs to a user in this tenant
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { tenants: true },
    });

    if (existingUser) {
      const alreadyInTenant = await prisma.userTenant.findFirst({
        where: { userId: existingUser.id, tenantId },
      });

      if (alreadyInTenant) {
        return new Response("User is already a member of this tenant", {
          status: 400,
        });
      }
    }

    // ✅ Check if invite already exists for same email + tenant
    const existingInvite = await prisma.invite.findFirst({
      where: { email, tenantId },
    });

    if (existingInvite) {
      return new Response("Invite already sent to this email", { status: 400 });
    }

    // Create a new invite
    const token = randomUUID();
    const invite = await prisma.invite.create({
      data: { email, tenantId, role, token },
    });

    // Optionally send an email with link like: /accept-invite?token=xxxx
    return new Response(JSON.stringify(invite));
  } catch (err: any) {
    const status =
      err.message?.includes("Unauthorized") || err.message?.includes("Forbidden")
        ? 403
        : 500;
    return new Response(err.message || "Failed to create invite", { status });
  }
}

