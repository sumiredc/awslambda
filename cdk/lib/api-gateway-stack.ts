import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { AppEnv } from "../bin/env";

// Node 20.x の Lambda 用 handler
function runtimeNode20(
  stack: APIGatewayStack,
  id: string,
  filepath: string,
  handlerName: string = "handler"
): NodejsFunction {
  return new NodejsFunction(stack, id, {
    runtime: Runtime.NODEJS_20_X,
    handler: handlerName,
    entry: path.join(__dirname, filepath),
    environment: stack.appEnv,
  });
}

export class APIGatewayStack extends Stack {
  public readonly appEnv: AppEnv;

  constructor(scope: Construct, id: string, props: StackProps, appEnv: AppEnv) {
    super(scope, id, props);
    this.appEnv = appEnv;

    // API Gateway
    const api = new RestApi(this, "SampleAPI", {
      restApiName: "SampleAPI",
      deployOptions: {
        stageName: "v1",
      },
    });
    api.latestDeployment?.addToLogicalId(new Date().toISOString());

    // Hello World
    api.root
      .addResource("hello-world")
      .addMethod(
        "GET",
        new LambdaIntegration(
          runtimeNode20(this, "HelloWorldFunction", "lambda/hello-world.ts")
        )
      );

    // Get Object
    api.root
      .addResource("get-object")
      .addMethod(
        "GET",
        new LambdaIntegration(
          runtimeNode20(this, "GetObjectFunction", "lambda/get-object.ts")
        )
      );

    // Create User
    api.root
      .addResource("create-user")
      .addMethod(
        "POST",
        new LambdaIntegration(
          runtimeNode20(this, "CreateUserFunction", "lambda/create-user.ts")
        )
      );

    // Send Mail
    api.root
      .addResource("send-mail")
      .addMethod(
        "POST",
        new LambdaIntegration(
          runtimeNode20(this, "SendMailFunction", "lambda/send-mail.ts")
        )
      );
  }
}
