# !/bin/sh
API_ID=$(docker compose exec aws awslocal apigateway get-rest-apis --query "items[0].id" --output text)
STAGE_NAME=$(docker compose exec aws awslocal apigateway get-stages --rest-api-id $API_ID --query "item[0].stageName" --output text)

BASE_URL="http://localhost:4566/_aws/execute-api/${API_ID}/{basePath}"

docker compose exec aws awslocal apigateway get-export \
    --rest-api-id $API_ID \
    --stage-name $STAGE_NAME \
    --export-type oas30 \
    --accepts application/json \
    temp.json

jq --arg url "$BASE_URL" '.servers[0].url = $url' cdk/temp.json > openapi.json
rm cdk/temp.json
