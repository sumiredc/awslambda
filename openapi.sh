# !/bin/sh
set -euo pipefail

BASE_URL="http://localhost:4566/_aws/execute-api/{apiID}/{basePath}"

error_exit() {
    echo "❌ エラー: $1" >&2
    exit 1
}

API_ID=$(docker compose exec aws awslocal apigateway get-rest-apis --query "items[0].id" --output text) || error_exit "API ID の取得に失敗しました"
STAGE=$(docker compose exec aws awslocal apigateway get-stages --rest-api-id $API_ID --query "item[0].stageName" --output text) || error_exit "ステージの取得に失敗しました"

docker compose exec aws awslocal apigateway get-export \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --export-type oas30 \
    --accepts application/json \
    temp.json || error_exit "API Gateway のスキーマ出力に失敗しました"

jq --arg url "$BASE_URL" \
    --arg apiid "$API_ID" \
    '.servers[0].url = $url | .servers[0].variables.apiID.default = $apiid' \
    cdk/temp.json > openapi.json

rm cdk/temp.json

