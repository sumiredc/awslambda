import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// CreateUser
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = new DynamoDBClient({});
  const input: PutItemCommandInput = {
    TableName: "user",
    Item: {
      id: { S: uuidv4() },
      name: { S: randomName() },
      created: { N: nowTimestamp() },
    },
  };
  const command = new PutItemCommand(input);

  try {
    await client.send(command);
    return {
      statusCode: 201,
      headers: { "Content-Type": "text/plain" },
      body: "Created",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

function nowTimestamp(): string {
  return String(Math.floor(new Date().getTime() / 1000));
}

function randomName(): string {
  const num = Math.floor(Math.random() * 99999);
  return `sumire${num}`;
}
