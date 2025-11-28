# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

# How to localstack

```sh
awslocal apigateway create-rest-api --name "Sample API" --profile=localstack
awslocal apigateway get-resources --rest-api-id uezo43t6el --profile=localstack
```

```sh
aws configure --profile localstack

AWS Access Key ID [None]: dummy
AWS Secret Access Key [None]: dummy
Default region name [None]: us-east-1
Default output format [None]: json
```

```sh
npm install --save-dev aws-cdk-local
```

## Lambda のデプロイ
```sh
# 初回のみ
npx cdklocal bootstrap

# デプロイ
npx cdklocal deploy --all
```

## Lambda の確認
```sh
awslocal --endpoint-url=http://localhost:4566 lambda list-functions
```

## API Gateway のデプロイ
```sh
aws apigateway create-rest-api --name 'Sample API' --endpoint-url=http://localhost:4566 --profile=localstack
```
```json
{
    "id": "mhy5fu2c8v",
    "name": "Sample API",
    "createdDate": 1764249674.0,
    "apiKeySource": "HEADER",
    "endpointConfiguration": {
        "types": [
            "EDGE"
        ],
        "ipAddressType": "ipv4"
    },
    "disableExecuteApiEndpoint": false,
    "rootResourceId": "gjewxddfo5"
}
```

## ルートリソース ID取得
```sh
aws apigateway get-resources --rest-api-id mhy5fu2c8v --endpoint-url=http://localhost:4566 --profile=localstack
```
```json
{
    "items": [
        {
            "id": "gjewxddfo5",
            "path": "/"
        }
    ]
}
```

## 子リソースを追加
```sh
aws apigateway create-resource --rest-api-id mhy5fu2c8v --parent-id gjewxddfo5 --path-part hello-world --endpoint-url=http://localhost:4566 --profile=localstack
```
```json
{
    "id": "edsmkry6aq",
    "parentId": "gjewxddfo5",
    "pathPart": "hello-world",
    "path": "/hello-world"
}
```

## GETメソッドを参照できるように設定
```sh
aws apigateway put-method --rest-api-id mhy5fu2c8v --resource-id edsmkry6aq --http-method GET --authorization-type "NONE" --endpoint-url=http://localhost:4566 --profile=localstack
```
```json
{
    "httpMethod": "GET",
    "authorizationType": "NONE",
    "apiKeyRequired": false
}
```

## API Gateway と Lambda の設定
```sh
aws apigateway put-integration \
  --rest-api-id mhy5fu2c8v \
  --resource-id edsmkry6aq \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:CdkStack-HelloFunctionD909AE8C-c03b5ddb/invocations \
  --passthrough-behavior WHEN_NO_MATCH \
  --endpoint-url=http://localhost:4566 \
  --profile=localstack
```
```json
{
    "type": "AWS_PROXY",
    "httpMethod": "POST",
    "uri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:000000000000:function:CdkStack-HelloFunctionD909AE8C-c03b5ddb/invocations",
    "passthroughBehavior": "WHEN_NO_MATCH",
    "timeoutInMillis": 29000,
    "cacheNamespace": "edsmkry6aq",
    "cacheKeyParameters": []
}
```

## API デプロイ
```sh
aws apigateway create-deployment \
  --rest-api-id mhy5fu2c8v \
  --stage-name local \
  --endpoint-url=http://localhost:4566 \
  --profile=localstack
```
```json
{
    "id": "nj84n7oldo",
    "createdDate": 1764249316.0
}
```

```sh
curl http://localhost:4566/restapis/mhy5fu2c8v/local/_user_request_/hello-world
```


## 確認
```sh
aws apigateway get-rest-apis --endpoint-url=http://localhost:4566 --profile=localstack
aws apigateway get-resources --rest-api-id mhy5fu2c8v --endpoint-url=http://localhost:4566 --profile=localstack
```


## DynamoDB
```sh
awslocal dynamodb list-tables
```


awslocal apigateway get-rest-apis --endpoint-url=http://localhost:4566 
awslocal apigateway get-resources --rest-api-id kiwefwlzpv --endpoint-url=http://localhost:4566
