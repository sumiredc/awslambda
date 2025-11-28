import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";

export class DynamoDBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Table(this, "UserTable", {
      // 'Sample-table'はStack内で一意
      tableName: "user", // テーブル名の定義
      partitionKey: {
        //パーティションキーの定義
        name: "id",
        type: AttributeType.STRING, // typeはあとNumberとbinary
      },
      sortKey: {
        // ソートキーの定義
        name: "name",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST, // オンデマンド請求
      timeToLiveAttribute: "expired", // TTLの設定
      removalPolicy: cdk.RemovalPolicy.DESTROY, // cdk destroyでDB削除可
    });
  }
}
