# !/bin/sh
set -euo pipefail

rm -rf cdk.out dist

npm install
npm run build

export $(cat .env | xargs)

npx cdklocal bootstrap
npx cdklocal deploy --all --require-approval never -y

# API Gateway との連携が切れるのを防ぐ
API_ID=$(awslocal apigateway get-rest-apis --query "items[0].id" --output text)
STAGE=$(awslocal apigateway get-stages --rest-api-id $API_ID --query "item[0].stageName" --output text)

echo "API ID: ${API_ID}"
echo "STAGE : ${STAGE}"
