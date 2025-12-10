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
