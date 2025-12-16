ENDPOINT_URL=http://motoserver:4000
COGNITO_USER_NAME=user
COGNITO_USER_EMAIL=user@example.com
COGNITO_USER_PASSWORD=Passw0rd+
LAMBDA_ROLE_NAME="moto-lambda-role"

create_user_pool() {
    awslocal cognito-idp create-user-pool \
        --pool-name MyUserPool \
        --query UserPool.Id \
        --output text \
        --endpoint-url ${ENDPOINT_URL}
}

create_user_pool_client() {
    awslocal cognito-idp create-user-pool-client \
        --client-name MyUserPoolClient \
        --user-pool-id ${USER_POOL_ID} \
        --output text \
        --query UserPoolClient.ClientId \
        --endpoint-url ${ENDPOINT_URL}
}

create_admin_user() {
    awslocal cognito-idp admin-create-user \
        --user-pool-id ${USER_POOL_ID} \
        --username ${COGNITO_USER_NAME} \
        --user-attributes Name=email,Value=${COGNITO_USER_EMAIL} Name=email_verified,Value=true \
        --message-action SUPPRESS \
        --endpoint-url ${ENDPOINT_URL}
}

set_admin_user_password() {
    awslocal cognito-idp admin-set-user-password \
        --user-pool-id ${USER_POOL_ID} \
        --username ${COGNITO_USER_NAME} \
        --password ${COGNITO_USER_PASSWORD} \
        --permanent \
        --endpoint-url ${ENDPOINT_URL}
}

create_lambda_role() {
    TRUST_POLICY='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

    ROLE_ARN=$(awslocal iam create-role \
        --role-name $LAMBDA_ROLE_NAME \
        --assume-role-policy-document "$TRUST_POLICY" \
        --endpoint-url $ENDPOINT_URL \
        --query 'Role.Arn' \
        --output text)

    awslocal iam put-role-policy \
        --role-name $LAMBDA_ROLE_NAME \
        --policy-name MotoSESPolicy \
        --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["ses:*","logs:*"],"Resource":"*"}]}' \
        --endpoint-url $ENDPOINT_URL

    echo ${ROLE_ARN}
}

# main

echo "🚀 ユーザープールを作成します..."
USER_POOL_ID=$(create_user_pool)
echo -e "✅️ ユーザープールを作成しました: ${USER_POOL_ID}\n"

echo "🚀 ユーザープールクライアントを作成します..."
CLIENT_ID=$(create_user_pool_client)
echo -e "✅️ ユーザープールクライアントを作成しました: ${CLIENT_ID}\n"

echo "🚀 Admin ユーザーを作成します..."
create_admin_user
echo -e "✅️ ユーザープールクライアントを作成しました:\n\t user:\t${COGNITO_USER_NAME}\n\t email:\t${COGNITO_USER_EMAIL}\n"

echo "🚀 Admin ユーザーのパスワードを設定します..."
set_admin_user_password
echo -e "✅️ Admin ユーザーのパスワードを設定しました\n"

echo "🚀 Lambda Trigger 用のロールを作成します..."
ROLE_ARN=$(create_lambda_role)
echo -e "✅️ Lambda Trigger 用のロールを作成しました: ${ROLE_ARN}\n"
