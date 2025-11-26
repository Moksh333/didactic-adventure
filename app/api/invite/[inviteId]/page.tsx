import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: {
    inviteId: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;

  const invite = await prisma.invite.findUnique({
    where: { id: params.inviteId },
  });

  if (!invite) {
    return <div>Invalid or expired invite.</div>;
  }

  await prisma.member.create({
    data: {
      userId,
      projectId: invite.projectId,
      role: "Member",
    },
  });

  await prisma.invite.delete({
    where: { id: params.inviteId },
  });

  redirect(`/project/${invite.projectId}`);
}
