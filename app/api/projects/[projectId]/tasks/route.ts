import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// ---------------------------------------------------------
// GET: Fetch all tasks for the project
// ---------------------------------------------------------
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = params;

  // Check if project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      manager: true,
      members: { include: { user: true } }
    }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const userEmail = session.user.email;

  const isManager = project.manager.email === userEmail;
  const isMember = project.members.some(m => m.user.email === userEmail);

  if (!isManager && !isMember) {
    return NextResponse.json(
      { error: "You do not have access to these tasks" },
      { status: 403 }
    );
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: { assignedTo: true },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(tasks, { status: 200 });
}



// ---------------------------------------------------------
// POST: Create a new task for the project (Manager ONLY)
// ---------------------------------------------------------
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = params;
  const { text, assignedToId } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Task text is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { manager: true }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Only manager can create tasks
  if (project.manager.email !== session.user.email) {
    return NextResponse.json(
      { error: "Only the project manager can create tasks" },
      { status: 403 }
    );
  }

  const task = await prisma.task.create({
    data: {
      text,
      projectId,
      assignedToId
    }
  });

  return NextResponse.json(task, { status: 201 });
}
