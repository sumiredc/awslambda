#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { DynamoDBStack } from "../lib/dynamodb-stack";
import { S3Stack } from "../lib/s3-stack";
import { loadEnv } from "./env";
import { OpenSearchStack } from "../lib/open-search-stack";
import { LambdaStack } from "../lib/lambda-stack";

const app = new cdk.App();
loadEnv(app);

// https://docs.aws.amazon.com/cdk/latest/guide/environments.html

new DynamoDBStack(app, "DynamoDBStack", {});
new LambdaStack(app, "LambdaStack", {});
new OpenSearchStack(app, "OpenSearchStack", {});
new S3Stack(app, "S3Stack", {});
