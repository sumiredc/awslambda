import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const USER_POOL_CLIENT_ID = "8a11ccf5356b411486064706d9";

export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const cognito = new CognitoIdentityServiceProvider({
    endpoint: "http://motoserver:4000",
  });

  try {
    const result = await cognito
      .initiateAuth({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: USER_POOL_CLIENT_ID,
        AuthParameters: {
          USERNAME: "user",
          PASSWORD: "Passw0rd+",
        },
      })
      .promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
