import {
  Cors,
  Deployment,
  LambdaIntegration,
  Method,
  RestApi,
  Stage,
} from "aws-cdk-lib/aws-apigateway";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { Duration, Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { loginAPI } from "./lambda/handler/auth/login";
import { helloWorldAPI } from "./lambda/handler/hello-world";

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
    timeout: Duration.seconds(30),
    environment: {
      ENV: process.env.ENV ?? "",
      BUCKET_NAME: process.env.BUCKET_NAME ?? "",
      SENDER_EMAIL: process.env.SENDER_EMAIL ?? "",
      AWS_ENDPOINT: process.env.AWS_ENDPOINT ?? "",
      OPENSEARCH_ENDPOINT: process.env.OPENSEARCH_ENDPOINT ?? "",
      MAIL_HOST: process.env.MAIL_HOST ?? "",
      MAIL_PORT: process.env.MAIL_PORT ?? "",
      MAIL_AUTH_USER: process.env.MAIL_AUTH_USER ?? "",
      MAIL_AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD ?? "",
      COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID ?? "",
      COGNITO_USER_POOL_CLIENT_ID:
        process.env.COGNITO_USER_POOL_CLIENT_ID ?? "",
      COGNITO_ENDPOINT: process.env.COGNITO_ENDPOINT ?? "",
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

    const defaultCors = {
      allowOrigins: ["*"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: Cors.DEFAULT_HEADERS,
    };

    // POST /login
    const loginResource = restAPI.root.addResource("login");
    loginResource.addCorsPreflight(defaultCors);
    loginResource.addMethod(
      "POST",
      new LambdaIntegration(
        runtimeNode20(
          this,
          "LoginFunction",
          "dist/lib/lambda/handler/auth/login.handler"
        )
      ),
      {
        requestParameters: loginAPI.request,
        methodResponses: loginAPI.responses,
      }
    );

    // GET /hello-world
    const helloWorldResource = restAPI.root.addResource("hello-world");
    helloWorldResource.addCorsPreflight(defaultCors);
    helloWorldResource.addMethod(
      "GET",
      new LambdaIntegration(
        runtimeNode20(
          this,
          "HelloWorldFunction",
          "dist/lib/lambda/handler/hello-world.handler"
        )
      ),
      {
        methodResponses: helloWorldAPI.responses,
      }
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
            "dist/lib/lambda/handler/get-object.handler"
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
            "dist/lib/lambda/handler/create-user.handler"
          )
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
            "dist/lib/lambda/handler/send-mail.handler"
          )
        )
      );

    const deployment = new Deployment(this, "Deployment", {
      api: restAPI,
    });

    restAPI.root.node.findAll().forEach((node) => {
      if (node instanceof Method) {
        deployment.node.addDependency(node);
      }
    });

    new Stage(this, "Stage", {
      deployment: deployment,
      stageName: "v1",
    });
  }
}
