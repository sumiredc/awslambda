import { Model } from "aws-cdk-lib/aws-apigateway";
import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Hello World
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
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
