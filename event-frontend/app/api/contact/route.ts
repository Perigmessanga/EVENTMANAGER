import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY!); // ⚠️ le "!" dit à TS que ce n'est pas undefined

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(3),
    message: z.string().min(10),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = contactSchema.parse(body);

        await resend.emails.send({
            from: "Contact <onboarding@resend.dev>",
            to: "tonemail@domain.com",
            subject: data.subject,
            replyTo: data.email,
            html: `<h2>Nouveau message</h2>
             <p><strong>Nom:</strong> ${data.name}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Message:</strong></p>
             <p>${data.message}</p>`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 400 });
    }
}
