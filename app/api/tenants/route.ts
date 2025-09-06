import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch tenants where the user is a member
    const tenants = await prisma.userTenant.findMany({
      where: { userId: session.user.id },
      include: {
        tenant: true,
      },
    });

    // Format response
    const data = tenants.map((ut) => ({
      id: ut.tenant.id,
      name: ut.tenant.name,
      createdAt: ut.tenant.createdAt,
      role: ut.role,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
