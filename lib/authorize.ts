import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function requireUserInTenant(req: Request, tenantId: string, requiredRoles: string[] = []) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userTenant = await prisma.userTenant.findFirst({
    where: { tenantId, userId: session.user.id },
  });
  if (!userTenant) throw new Error("Forbidden");

  if (requiredRoles.length > 0 && !requiredRoles.includes(userTenant.role)) {
    throw new Error("Insufficient permissions");
  }

  return { session, userTenant };
}

