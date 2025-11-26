import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Fetch tasks visible to the current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Fetch tasks assigned to this user or managed by them
  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ assignedToId: user?.id }, { project: { managerId: user?.id } }],
    },
    include: {
      project: true,
      assignedTo: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

// Create new task (only PM can do this)
export async function POST(req: Request) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, text, assignedToEmail } = await req.json();

  if (!text || !projectId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Get PM user
  const manager = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Validate project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.managerId !== manager?.id) {
    return NextResponse.json(
      { error: "Only the Project Manager can assign tasks." },
      { status: 403 }
    );
  }

  // 🔥 FIX: Only lookup assignee if email is provided
  let assigneeId = null;

  if (assignedToEmail && assignedToEmail.trim() !== "") {
    const assignee = await prisma.user.findUnique({
      where: { email: assignedToEmail },
    });

    assigneeId = assignee?.id ?? null;
  }

  // Create the task
  const newTask = await prisma.task.create({
    data: {
      text,
      projectId,
      assignedToId: assigneeId,  // null if no assignee
    },
  });

  return NextResponse.json(newTask);
}

