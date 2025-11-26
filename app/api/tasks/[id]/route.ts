import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await getSession();
  const { taskId } = params;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, completed } = await req.json();
  const currentUserEmail = session.user.email;

  // Fetch the task along with assigned user and project manager
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignedTo: true,
      project: {
        include: {
          manager: true,
        },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const isManager = task.project.manager.email === currentUserEmail;
  const isAssignee = task.assignedTo?.email === currentUserEmail;

  // Only manager or the assigned user can update the task
  if (!isManager && !isAssignee) {
    return NextResponse.json(
      { error: "You do not have permission to update this task" },
      { status: 403 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      text: text ?? task.text,
      completed: completed ?? task.completed,
    },
  });

  return NextResponse.json(updatedTask, { status: 200 });
}

// ==================================
// DELETE Task (Manager Only)
// ==================================
export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = params;
    const currentUserEmail = session.user.email;

    // Fetch task with project and manager
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            manager: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isManager = task.project.manager.email === currentUserEmail;

    if (!isManager) {
      return NextResponse.json(
        { error: "Only the project manager can delete tasks" },
        { status: 403 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

