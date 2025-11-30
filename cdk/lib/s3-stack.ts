import { Bucket } from "aws-cdk-lib/aws-s3";
import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { AppEnv } from "../bin/env";

export class S3Stack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, appEnv: AppEnv) {
    super(scope, id, props);

    new Bucket(this, "CreateBucket", {
      bucketName: appEnv.bucketName,
      versioned: true,
    });
  }
}
