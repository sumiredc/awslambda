import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASSWORD,
  },
});

export interface SendMailProps {
  to: string;
  subject: string;
  body: string;
}

export async function sendMail({ to, subject, body }: SendMailProps) {
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text: body,
  });
}
