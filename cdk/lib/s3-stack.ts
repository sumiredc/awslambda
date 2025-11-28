import { Bucket } from "aws-cdk-lib/aws-s3";
import { Stack, StackProps } from "aws-cdk-lib/core";
import { Construct } from "constructs";

export class S3Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Bucket(this, "CreateBucket", {
      bucketName: "sample-bucket",
      versioned: true,
    });
  }
}
