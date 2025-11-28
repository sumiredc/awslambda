#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { APIGatewayStack } from "../lib/api-gateway-stack";
import { DynamoDBStack } from "../lib/dynamodb-stack";

const app = new cdk.App();

// https://docs.aws.amazon.com/cdk/latest/guide/environments.html

new APIGatewayStack(app, "APIGatewayStack", {});
new DynamoDBStack(app, "DynamoDBStack", {});
