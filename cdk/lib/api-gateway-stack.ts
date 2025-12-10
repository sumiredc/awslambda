import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { AppEnv } from "../bin/env";

export class APIGatewayStack extends Stack {
  public readonly restAPI: RestApi;

  constructor(scope: Construct, id: string, props: StackProps, appEnv: AppEnv) {
    super(scope, id, props);

    this.restAPI = new RestApi(this, "SampleAPI", {
      restApiName: "SampleAPI",
      deployOptions: {
        stageName: "v1",
      },
    });
    // this.restAPI.latestDeployment?.addToLogicalId(new Date().toISOString());
  }
}
