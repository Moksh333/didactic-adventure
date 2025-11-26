import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    // console.log("🔵 API HIT /projects/", params);

    // MUST pass req here
    const session = await getServerSession({ req, ...authOptions });
    console.log("🟢 SESSION:", session);

    if (!session?.user?.email) {
      console.log("🔴 No session.user.email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const userEmail = session.user.email;
    console.log("🟣 Fetching project:", projectId);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        manager: true,
        members: { include: { user: true } },
        tasks: {
          include: { assignedTo: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    console.log("🟠 Project found:", project);

    if (!project) {
      console.log("🔴 Project not found");
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isManager = project.manager.email === userEmail;
    const isMember = project.members.some((m) => m.user.email === userEmail);

    console.log("🟢 Access status → manager:", isManager, "member:", isMember);

    if (!isManager && !isMember) {
      console.log("🔴 Access denied");
      return NextResponse.json(
        { error: "You do not have access to this project" },
        { status: 403 }
      );
    }

    return NextResponse.json({ project, role: isManager ? "pm" : "member" }, { status: 200 });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

