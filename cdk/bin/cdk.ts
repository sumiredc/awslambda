#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { APIGatewayStack } from "../lib/api-gateway-stack";
import { DynamoDBStack } from "../lib/dynamodb-stack";
import { S3Stack } from "../lib/s3-stack";
import { getAppEnv } from "./env";
import { Environment } from "aws-cdk-lib/aws-appconfig";

const app = new cdk.App();
const appEnv = getAppEnv(app);

// https://docs.aws.amazon.com/cdk/latest/guide/environments.html

new APIGatewayStack(app, "APIGatewayStack", {});
new DynamoDBStack(app, "DynamoDBStack", {});
new S3Stack(app, "S3Stack", {}, appEnv);
