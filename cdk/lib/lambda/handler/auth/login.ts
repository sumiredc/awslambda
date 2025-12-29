import { Model } from "aws-cdk-lib/aws-apigateway";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { CORS_HEADERS } from "lib/utils/cors";

const cognito = new CognitoIdentityServiceProvider({
  endpoint: process.env.COGNITO_ENDPOINT!,
});

export interface LoginRequest {
  username: string;
  password: string;
}

// パスワード認証
// https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-lambda-challenge.html
export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const request: LoginRequest = JSON.parse(event.body ?? "");

  if (!request.username || !request.password) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      body: JSON.stringify({ message: "Bad Request" }),
    };
  }

  try {
    const result = await cognito
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
        AuthParameters: {
          USERNAME: request.username,
          PASSWORD: request.password,
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

export const loginAPI = {
  request: {
    username: true,
    password: true,
  },
  responses: [
    {
      statusCode: "200",
      responseModels: {
        "application/json": Model.EMPTY_MODEL,
      },
    },
    { statusCode: "500" },
  ],
};
