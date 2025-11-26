import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;

    // 1. Check if user is a project member
    const member = await prisma.member.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      },
    });

    // 2. Fetch project & check if user is PM
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isPM = project.managerId === session.user.id;

    // 3. Block access if neither PM nor member
    if (!member && !isPM) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Fetch actual accepted team members
    const members = await prisma.member.findMany({
      where: { projectId },
      include: {
        user: true,
      },
      orderBy: {
        user: {
          email: "asc",
        },
      },
    });

    // 5. Fetch pending invitations
    const invites = await prisma.invite.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    // 6. Return EVERYTHING needed by PMView
    return NextResponse.json({
      members,
      invites,
      role: isPM ? "pm" : "member",
    });

  } catch (e) {
    console.error("🔥 Error in GET members route:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

