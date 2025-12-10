import { S3 } from "aws-sdk";
import { Handler } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetObjectRequest } from "aws-sdk/clients/s3";

const config: S3.ClientConfiguration = {
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
};

// GetObject
export const handler: Handler = async (
  _: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const s3 = new S3(config);
  const params: GetObjectRequest = {
    Bucket: process.env.BUCKET_NAME || "",
    Key: "laptop.png",
  };

  try {
    const res = await s3.getObject(params).promise();
    const base64Image =
      res.Body instanceof Buffer ? res.Body.toString("base64") : "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: base64Image,
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
