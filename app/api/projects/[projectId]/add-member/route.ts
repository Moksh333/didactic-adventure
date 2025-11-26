import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = params;
  const body = await req.json();
  const { email } = body;

  // Ensure only manager can add members
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { manager: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.manager.email !== session.user.email) {
    return NextResponse.json(
      { error: "Only the project manager can add members" },
      { status: 403 }
    );
  }

  // Find user to add
  const userToAdd = await prisma.user.findUnique({ where: { email } });

  if (!userToAdd) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Create membership
  const member = await prisma.member.create({
    data: {
      userId: userToAdd.id,
      projectId,
      role: "Member", // default
    },
  });

  return NextResponse.json(member);
}
