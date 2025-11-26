import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();
    const { projectId } = params;

    // 1. Check if requester is PM of the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.managerId !== session.user.id) {
      return NextResponse.json({ error: "Only PMs can invite" }, { status: 403 });
    }

    // 2. Find the invited user in the database
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json(
        {
          error:
            "User does not exist. They must sign in at least once before being added.",
        },
        { status: 400 }
      );
    }

    // 3. Check if they're already a member of the project
    const existing = await prisma.member.findFirst({
      where: {
        userId: invitedUser.id,
        projectId,
      },
    });

    if (existing) {
      return NextResponse.json({
        message: "Member already part of this project",
        member: existing,
      });
    }

    // 4. Add the user as a project member
    const member = await prisma.member.create({
      data: {
        userId: invitedUser.id,
        role: "member",
        projectId,
      },
      include: {
        user: true, // return user data also
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
