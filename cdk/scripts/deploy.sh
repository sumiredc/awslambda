# !/bin/sh
set -euo pipefail

error_exit() {
    echo "❌ エラー: $1" >&2
    exit 1
}

rm -rf cdk.out dist

npm install
npm run build

export $(cat .env | xargs)

npx cdklocal bootstrap
npx cdklocal deploy --all --require-approval never -y

# API Gateway との連携が切れるのを防ぐ
API_ID=$(awslocal apigateway get-rest-apis --query "items[0].id" --output text) || error_exit "API ID の取得に失敗しました"
STAGE=$(awslocal apigateway get-stages --rest-api-id $API_ID --query "item[0].stageName" --output text) || error_exit "ステージの取得に失敗しました"

awslocal apigateway create-deployment --rest-api-id $API_ID --stage-name $STAGE

echo "API ID: ${API_ID}"
echo "STAGE : ${STAGE}"
