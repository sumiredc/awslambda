import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { AppEnv } from "../bin/env";
import { Domain, EngineVersion } from "aws-cdk-lib/aws-opensearchservice";
import { EbsDeviceVolumeType } from "aws-cdk-lib/aws-ec2";

export class OpenSearchStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, appEnv: AppEnv) {
    super(scope, id, props);

    new Domain(this, "sample", {
      version: EngineVersion.OPENSEARCH_2_5,
      ebs: {
        volumeSize: 30,
        volumeType: EbsDeviceVolumeType.GP3,
        throughput: 125,
        iops: 3000,
      },
    });
  }
}
