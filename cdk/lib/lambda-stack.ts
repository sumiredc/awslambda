import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { AppEnv } from "../bin/env";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";

// Lambda のコンテナが立ち上がる際に HOST PC のパスを辿るため
// 環境変数でホスト PC のパスを受け取る
const hostPath = process.env.HOST_PROJECT_PATH || "UNRESOLVE_HOST_PROJECT_PATH";
console.log("HOST PC PATH", hostPath);

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
    environment: stack.appEnv,
  });
}

export class LambdaStack extends Stack {
  public readonly appEnv: AppEnv;
  public readonly bucket: IBucket;

  constructor(
    scope: Construct,
    id: string,
    props: StackProps,
    appEnv: AppEnv,
    restAPI: RestApi
  ) {
    super(scope, id, props);
    this.appEnv = appEnv;
    this.bucket = Bucket.fromBucketName(this, "HotReloadBucket", "hot-reload");

    // Hello World
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

    // Get Object
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

    // Create User
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

    // Send Mail
    restAPI.root
      .addResource("send-mail")
      .addMethod(
        "POST",
        new LambdaIntegration(
          runtimeNode20(this, "SendMailFunction", "dist/lib/lambda/send-mail")
        )
      );
  }
}
