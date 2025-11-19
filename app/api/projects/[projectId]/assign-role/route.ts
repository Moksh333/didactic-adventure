import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getSession();
  const { projectId } = params;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { memberId, role } = body;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { manager: true },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  if (project.manager.email !== session.user.email) {
    return NextResponse.json(
      { error: "Only the project manager can assign roles" },
      { status: 403 }
    );
  }

  const updated = await prisma.member.update({
    where: { id: memberId },
    data: { role },
  });

  return NextResponse.json(updated);
}
