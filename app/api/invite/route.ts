import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { getSession } from "@/lib/auth";  // <-- your helper
import { Session } from "inspector/promises";

export async function POST(req: Request) {
  try {
    // const session = await getSession();

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    const invitedById = session.user.id?session.user.id:"Moksh";
    const { email, projectId } = await req.json();

    // 1. Create invite record
    const invite = await prisma.invite.create({
      data: {
        email,
        projectId,
        invitedById,
      },
    });

    // 2. Create invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.id}`;

    // 3. Send email
    await resend.emails.send({
      from: "Invite <no-reply@yourdomain.com>",
      to: email,
      subject: "You're invited to collaborate",
      html: `
        <h2>You've been invited!</h2>
        <p>Click below to accept:</p>
        <a href="${inviteLink}">Accept Invite</a>
      `,
    });

    return NextResponse.json({ success: true, invite });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }
}
