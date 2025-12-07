import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { Client } from "@opensearch-project/opensearch";
import {
  Index_Request,
  Index_Response,
  Indices_Create_Response,
  Indices_Exists_Request,
} from "@opensearch-project/opensearch/api";

interface User {
  id: string;
  name: string;
}

// CreateUser
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const OPENSEARCH_INDEX_NAME = "users";

  const user: User = {
    id: uuidv4(),
    name: randomName(),
  };

  const dbClient = new DynamoDBClient({});
  const input: PutItemCommandInput = {
    TableName: "user",
    Item: {
      id: { S: user.id },
      name: { S: user.name },
      created: { N: nowTimestamp() },
    },
  };
  const command = new PutItemCommand(input);

  // DynamoDB 登録
  try {
    await dbClient.send(command);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }

  const osClient = new Client({
    node: process.env.OPENSEARCH_ENDPOINT,
  });

  // OpenSearch 登録
  try {
    const exists = await existsIndex(osClient, OPENSEARCH_INDEX_NAME);
    if (!exists) {
      await createIndex(osClient, OPENSEARCH_INDEX_NAME);
    }

    await addIndex(osClient, OPENSEARCH_INDEX_NAME, user);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }

  return {
    statusCode: 201,
    headers: { "Content-Type": "text/plain" },
    body: "Created",
  };
};

function nowTimestamp(): string {
  return String(Math.floor(new Date().getTime() / 1000));
}

function randomName(): string {
  const num = Math.floor(Math.random() * 99999);
  return `sumire${num}`;
}

/**
 * OpenSearch インデックスの存在確認
 *
 * @param {Client} client
 * @param {string} indexName
 * @returns {Promise<boolean>}
 */
async function existsIndex(
  client: Client,
  indexName: string
): Promise<boolean> {
  const params: Indices_Exists_Request = { index: indexName };
  const response = await client.indices.exists(params);

  return response.body;
}

/**
 * OpenSearch インデックスの作成
 *
 * @param {Client} client
 * @param {string} indexName
 * @returns {Promise<Indices_Create_Response>}
 */
async function createIndex(
  client: Client,
  indexName: string
): Promise<Indices_Create_Response> {
  const params: Index_Request = {
    index: indexName,
    body: {
      mappings: {
        properties: {
          id: { type: "keyword" },
          name: { type: "text" },
        },
      },
    },
  };

  return await client.indices.create(params);
}

/**
 * OpenSearch インデックスの追加
 *
 * @param {Client} client
 * @param {string} indexName
 * @param {User} user
 * @returns {Promise<Index_Response>}
 */
async function addIndex(
  client: Client,
  indexName: string,
  user: User
): Promise<Index_Response> {
  const params: Index_Request = {
    index: indexName,
    id: user.id,
    body: user,
  };

  return await client.index(params);
}
