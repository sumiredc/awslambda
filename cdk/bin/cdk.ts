#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib/core";
import { config } from "dotenv";
import { DynamoDBStack } from "../lib/dynamodb-stack";
import { LambdaStack } from "../lib/lambda-stack";
import { OpenSearchStack } from "../lib/open-search-stack";
import { S3Stack } from "../lib/s3-stack";

const app = new cdk.App();
loadEnv(app);

export function loadEnv(app: App) {
  let envPath = ".env";
  let envCognitoPath = ".env.cognito";
  const env = app.node.tryGetContext("env");
  if (env) {
    envPath += `.${env}`;
    envCognitoPath += `.${env}`;
  }

  config({ path: [envPath, envCognitoPath] });
}

// https://docs.aws.amazon.com/cdk/latest/guide/environments.html

new DynamoDBStack(app, "DynamoDBStack", {});
new LambdaStack(app, "LambdaStack", {});
new OpenSearchStack(app, "OpenSearchStack", {});
new S3Stack(app, "S3Stack", {});
