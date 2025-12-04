import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTransport } from "nodemailer";

// Send Mail
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const transporter = createTransport({
    host: "mailhog",
    port: 1025,
    secure: false,
    auth: {
      user: "user",
      pass: "password",
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
