#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { APIGatewayStack } from "../lib/api-gateway-stack";
import { DynamoDBStack } from "../lib/dynamodb-stack";
import { S3Stack } from "../lib/s3-stack";
import { getAppEnv } from "./env";
import { OpenSearchStack } from "../lib/open-search-stack";
import { LambdaStack } from "../lib/lambda-stack";

const app = new cdk.App();
const appEnv = getAppEnv(app);

// https://docs.aws.amazon.com/cdk/latest/guide/environments.html

const apiGatewayStack = new APIGatewayStack(app, "APIGatewayStack", {}, appEnv);
new DynamoDBStack(app, "DynamoDBStack", {}, appEnv);
new LambdaStack(app, "LambdaStack", {}, appEnv, apiGatewayStack.restAPI);
new OpenSearchStack(app, "OpenSearchStack", {}, appEnv);
new S3Stack(app, "S3Stack", {}, appEnv);
