https://app.localstack.cloud/

ses は使用不可（pro プランのみ）

# Open Search

```sh
awslocal --endpoint-url=http://localhost:4566 opensearch list-domain-names
```
```sh
curl -X GET http://opensearchstack-sample19a77b.us-east-1.opensearch.localhost.localstack.cloud:4566/_cat/indices?v
curl -X GET http://opensearchstack-sample19a77b.us-east-1.opensearch.localhost.localstack.cloud:4566/users/_search?pretty
curl -X GET http://opensearchstack-sample19a77b.us-east-1.opensearch.localhost.localstack.cloud:4566/users/_mapping?pretty
```

# API Gateway 経由のエンドポイント
```sh
curl -X GET http://localhost:4566/_aws/execute-api/{app-id}/{stage}/hello-world
```

The API id 'xxx' does not correspond to a deployed API Gateway API が発生する場合
```sh
awslocal apigateway create-deployment --rest-api-id xxx --stage-name v1
```

# Cognito (motoserver)
```sh
ENDPOINT_URL=http://localhost:4000
COGNITO_USER_NAME=user
COGNITO_USER_EMAIL=user@example.com
COGNITO_USER_PASSWORD=Passw0rd+

# ap-northeast-1_00b5aa457f62426c8900c4a8b3fde0ab
USER_POOL_ID=$(
aws cognito-idp create-user-pool \
    --pool-name MyUserPool \
    --query UserPool.Id \
    --output text \
    --endpoint-url ${ENDPOINT_URL} \
)

# 8a11ccf5356b411486064706d9
CLIENT_ID=$(
aws cognito-idp create-user-pool-client \
    --client-name MyUserPoolClient \
    --user-pool-id ${USER_POOL_ID} \
    --output text \
    --query UserPoolClient.ClientId \
    --endpoint-url ${ENDPOINT_URL} \
)

aws cognito-idp admin-create-user \
    --user-pool-id ${USER_POOL_ID} \
    --username ${COGNITO_USER_NAME} \
    --user-attributes Name=email,Value=${COGNITO_USER_EMAIL} Name=email_verified,Value=true \
    --message-action SUPPRESS \
    --endpoint-url ${ENDPOINT_URL}

aws cognito-idp admin-set-user-password \
  --user-pool-id ${USER_POOL_ID} \
  --username ${COGNITO_USER_NAME} \
  --password ${COGNITO_USER_PASSWORD} \
  --permanent \
  --endpoint-url ${ENDPOINT_URL}

aws cognito-idp list-users \
  --user-pool-id ${USER_POOL_ID} \
  --query "Users[0].[Username,UserStatus]" \
  --endpoint-url ${ENDPOINT_URL}
```

```json
{
    "User": {
        "Username": "user",
        "Attributes": [
            {
                "Name": "email",
                "Value": "user@example.com"
            },
            {
                "Name": "email_verified",
                "Value": "true"
            },
            {
                "Name": "sub",
                "Value": "1942606d-69a2-4a82-b010-99e54e124f41"
            }
        ],
        "UserCreateDate": "2025-12-13T14:38:41+09:00",
        "UserLastModifiedDate": "2025-12-13T14:38:41+09:00",
        "Enabled": true,
        "UserStatus": "FORCE_CHANGE_PASSWORD",
        "MFAOptions": []
    }
}
```
