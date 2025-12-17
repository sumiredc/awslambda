#!/bin/bash

MOTO_ENDPOINT="http://motoserver:4000"
REGION="us-east-1"
SRC_DIR="./lib/lambda/trigger"
DIST_DIR="./dist_moto"
LAMBDA_ROLE_NAME="moto-lambda-role"

ACCOUNT_ID=$(awslocal sts get-caller-identity --endpoint-url http://motoserver:4000 --query 'Account' --output text)

# --- 関数: ビルド & Zip & Lambdaデプロイ ---
deploy_lambda() {
    FUNC_NAME=$1
    FILE_NAME=$2

    mkdir -p "$DIST_DIR/$FUNC_NAME"

    npx esbuild "$SRC_DIR/$FILE_NAME" \
        --bundle \
        --platform=node \
        --target=node18 \
        --outfile="$DIST_DIR/$FUNC_NAME/index.js" \
        --external:aws-sdk

    cd "$DIST_DIR/$FUNC_NAME"
    zip -q -r ../$FUNC_NAME.zip .
    cd - > /dev/null

    # 既存があれば削除（エラー無視）
    awslocal lambda delete-function --function-name $FUNC_NAME --endpoint-url $MOTO_ENDPOINT > /dev/null 2>&1
    
    # 作成してARNを取得
    local ARN=$(awslocal lambda create-function \
        --function-name $FUNC_NAME \
        --runtime nodejs18.x \
        --role arn:aws:iam::${ACCOUNT_ID}:role/${LAMBDA_ROLE_NAME} \
        --handler index.handler \
        --zip-file fileb://"$DIST_DIR/$FUNC_NAME.zip" \
        --endpoint-url $MOTO_ENDPOINT \
        --query 'FunctionArn' \
        --output text)

    echo $ARN
}

# クリーンアップ
rm -rf $DIST_DIR

# 1. 各Lambdaをデプロイし、ARNを変数に格納
ARN_CREATE=$(deploy_lambda "CreateAuthChallenge" "create_auth_challenge.ts")
ARN_DEFINE=$(deploy_lambda "DefineAuthChallenge" "define_auth_challenge.ts")
ARN_VERIFY=$(deploy_lambda "VerifyAuthChallengeResponse" "verify_auth_challenge_response.ts")

EXISTING_POOL_ID=$(awslocal cognito-idp list-user-pools --max-results 1 \
    --endpoint-url $MOTO_ENDPOINT \
    --query 'UserPools[0].Id' \
    --output text)

if [ "$EXISTING_POOL_ID" = "None" ]; then
    echo "❌ Error: User Pool not found in motoserver."
    echo "Please create a User Pool first or check if motoserver is running."
    exit 1
fi

echo "   Found Pool ID: $EXISTING_POOL_ID"

# 3. User Pool を更新してトリガーを紐付ける
echo "🔗 Linking Lambda Triggers to User Pool..."

# update-user-pool は指定しなかった項目がリセットされる可能性があるため、
# トリガー設定(LambdaConfig)のみを安全に適用します。
awslocal cognito-idp update-user-pool \
    --user-pool-id $EXISTING_POOL_ID \
    --lambda-config "CreateAuthChallenge=$ARN_CREATE,DefineAuthChallenge=$ARN_DEFINE,VerifyAuthChallengeResponse=$ARN_VERIFY" \
    --endpoint-url $MOTO_ENDPOINT

echo "--------------------------------------------------"
echo "✅ Update Complete!"
echo "   User Pool ($EXISTING_POOL_ID) is now linked to:"
echo "   - CreateAuthChallenge: $ARN_CREATE"
echo "   - DefineAuthChallenge: $ARN_DEFINE"
echo "   - VerifyAuthChallengeResponse: $ARN_VERIFY"
echo "--------------------------------------------------"
