# !/bin/sh
API_ID=$(docker compose exec aws awslocal apigateway get-rest-apis --query "items[0].id" --output text)
STAGE=$(docker compose exec aws awslocal apigateway get-stages --rest-api-id $API_ID --query "item[0].stageName" --output text)

BASE_URL="http://localhost:4566/_aws/execute-api/{apiID}/{basePath}"

docker compose exec aws awslocal apigateway get-export \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --export-type oas30 \
    --accepts application/json \
    temp.json

jq --arg url "$BASE_URL" \
    --arg apiid "$API_ID" \
    '.servers[0].url = $url | .servers[0].variables.apiID.default = $apiid' \
    cdk/temp.json > openapi.json

rm cdk/temp.json

