import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendMail } from "lib/repository/mail";

// Send Mail
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const response = await sendMail({
      to: "receiver@example.com",
      subject: "テストメール",
      body: "これはテストメールです",
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
