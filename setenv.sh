# !/bin/sh

# API Gateway
API_ID=$(docker compose exec aws awslocal apigateway get-rest-apis --query "items[0].id" --output text)
STAGE=$(docker compose exec aws awslocal apigateway get-stages --rest-api-id $API_ID --query "item[0].stageName" --output text)

echo "VITE_API_ID=${API_ID}" > front/.env
echo "VITE_API_STAGE=${STAGE}" >> front/.env

# Cognito
MOTO_ENDPOINT=http://motoserver:4000

USER_POOL_ID=$(docker compose exec aws awslocal cognito-idp list-user-pools --max-results 1 --endpoint-url $MOTO_ENDPOINT --query 'UserPools[0].Id' --output text)
CLIENT_ID=$(docker compose exec aws awslocal cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --endpoint-url $MOTO_ENDPOINT --query 'UserPoolClients[0].ClientId' --output text)

echo "COGNITO_USER_POOL_ID=${USER_POOL_ID}" > cdk/.env.cognito
echo "COGNITO_USER_POOL_CLIENT_ID=${CLIENT_ID}" >> cdk/.env.cognito
