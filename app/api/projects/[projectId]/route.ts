import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = params;
  const userEmail = session.user.email;

  // Fetch project with manager, members, tasks
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      manager: true,
      members: {
        include: {
          user: true,
        },
      },
      tasks: {
        include: {
          assignedTo: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const isManager = project.manager.email === userEmail;
  const isMember = project.members.some(
    (m) => m.user.email === userEmail
  );

  if (!isManager && !isMember) {
    return NextResponse.json(
      { error: "You do not have access to this project" },
      { status: 403 }
    );
  }

  return NextResponse.json(project, { status: 200 });
}
