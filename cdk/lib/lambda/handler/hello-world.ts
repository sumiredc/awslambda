import { Model } from "aws-cdk-lib/aws-apigateway";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { CORS_HEADERS } from "lib/utils/cors";

// Hello World
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    body: JSON.stringify({ message: "Hello World!" }),
  };
};

export const helloWorldAPI = {
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
