import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

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
  });
}

export class APIGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
  }
}
