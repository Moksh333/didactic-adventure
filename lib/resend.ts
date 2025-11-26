import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendInvite(email: string, projectId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const invitedById = session.user.id ?? "Moksh";

    const invite = await prisma.invite.create({
      data: {
        email,
        projectId,
        invitedById,
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.id}`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "You're invited to collaborate",
      html: `
        <h2>You've been invited!</h2>
        <p>Click below to accept:</p>
        <a href="${inviteLink}">Accept Invite</a>
      `,
    });

    console.log('hi');
    

    return { success: true, invite };
  } catch (error) {
    console.error("Invite error:", error);
    return { success: false, error: "Failed to send invite" };
  }
}
