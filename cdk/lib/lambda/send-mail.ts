import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTransport } from "nodemailer";

// Send Mail
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASSWORD,
    },
  });

  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: "receiver@example.com",
      subject: "テストメール",
      text: "これはテストメールです",
    });

    console.info(response);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: "OK",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
