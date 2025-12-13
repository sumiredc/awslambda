import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";

// Lambda のコンテナが立ち上がる際に HOST PC のパスを辿るため
// 環境変数でホスト PC のパスを受け取る
const hostPath = process.env.HOST_PROJECT_PATH || "UNRESOLVE_HOST_PROJECT_PATH";

/**
 *  Node 20.x の Lambda 用 handler
 * @param stack
 * @param id
 * @param handlerName project root からみた相対パス
 * @returns
 */
function runtimeNode20(
  stack: LambdaStack,
  id: string,
  handlerName: string
): NodejsFunction {
  return new NodejsFunction(stack, id, {
    runtime: Runtime.NODEJS_20_X,
    code: Code.fromBucket(stack.bucket, hostPath),
    handler: handlerName,
    environment: {
      BUCKET_NAME: process.env.BUCKET_NAME ?? "",
      SENDER_EMAIL: process.env.SENDER_EMAIL ?? "",
      AWS_ENDPOINT: process.env.AWS_ENDPOINT ?? "",
      OPENSEARCH_ENDPOINT: process.env.OPENSEARCH_ENDPOINT ?? "",
      MAIL_HOST: process.env.MAIL_HOST ?? "",
      MAIL_PORT: process.env.MAIL_PORT ?? "",
      MAIL_AUTH_USER: process.env.MAIL_AUTH_USER ?? "",
      MAIL_AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD ?? "",
      COGNITO_USER_POOL_CLIENT_ID:
        process.env.COGNITO_USER_POOL_CLIENT_ID ?? "",
    },
  });
}

export class LambdaStack extends Stack {
  public readonly bucket: IBucket;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.bucket = Bucket.fromBucketName(this, "HotReloadBucket", "hot-reload");

    const restAPI = new RestApi(this, "SampleAPI", {
      restApiName: "SampleAPI",
      deploy: false,
    });

    // GET /hello-world
    restAPI.root
      .addResource("hello-world")
      .addMethod(
        "GET",
        new LambdaIntegration(
          runtimeNode20(
            this,
            "HelloWorldFunction",
            "dist/lib/lambda/hello-world.handler"
          )
        )
      );

    // GET /get-object
    restAPI.root
      .addResource("get-object")
      .addMethod(
        "GET",
        new LambdaIntegration(
          runtimeNode20(
            this,
            "GetObjectFunction",
            "dist/lib/lambda/get-object.handler"
          )
        )
      );

    // POST /create-user
    restAPI.root
      .addResource("create-user")
      .addMethod(
        "POST",
        new LambdaIntegration(
          runtimeNode20(
            this,
            "CreateUserFunction",
            "dist/lib/lambda/create-user.handler"
          )
        )
      );

    // POST /login
    restAPI.root
      .addResource("login")
      .addMethod(
        "POST",
        new LambdaIntegration(
          runtimeNode20(this, "LoginFunction", "dist/lib/lambda/login.handler")
        )
      );

    // POST /send-mail
    restAPI.root
      .addResource("send-mail")
      .addMethod(
        "POST",
        new LambdaIntegration(
          runtimeNode20(
            this,
            "SendMailFunction",
            "dist/lib/lambda/send-mail.handler"
          )
        )
      );

    new AwsCustomResource(this, "TriggerDeployment", {
      onCreate: {
        service: "APIGateway",
        action: "createDeployment",
        parameters: {
          restApiId: restAPI.restApiId,
          stageName: "v1",
        },
        physicalResourceId: PhysicalResourceId.of(new Date().toISOString()),
      },
      onUpdate: {
        service: "APIGateway",
        action: "createDeployment",
        parameters: {
          restApiId: restAPI.restApiId,
          stageName: "v1",
        },
        physicalResourceId: PhysicalResourceId.of(new Date().toISOString()),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }
}
