import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { CORS_HEADERS } from "lib/utils/cors";

const USERNAME = "user";
const PASSWORD = "Passw0rd+";
const cognito = new CognitoIdentityServiceProvider({
  endpoint: process.env.COGNITO_ENDPOINT!,
});

// パスワード認証
// https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-lambda-challenge.html
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const result = await cognito
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
        AuthParameters: {
          USERNAME,
          PASSWORD,
        },
      })
      .promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
};
