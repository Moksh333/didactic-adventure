import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      manager: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });

  return NextResponse.json(project, { status: 201 });
}
export async function GET() {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  // Projects where user is manager
  const managedProjects = await prisma.project.findMany({
    where: {
      manager: {
        email,
      },
    },
    include: {
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    },
  });

  // Projects where user is member
  const memberProjects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          user: { email },
        },
      },
    },
    include: {
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      managedProjects,
      memberProjects,
    },
    { status: 200 }
  );
}