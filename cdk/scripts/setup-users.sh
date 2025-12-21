#!/bin/bash
set -euo pipefail

ENDPOINT_URL=http://motoserver:4000
COGNITO_USER_PASSWORD=Passw0rd+
JSON_FILE="scripts/resources/users.json"

error_exit() {
    echo "❌ エラー: $1" >&2
    exit 1
}

create_admin_user() {
    local user_pool_id=$1
    local username=$2
    local email=$3

    awslocal cognito-idp admin-create-user \
        --user-pool-id ${user_pool_id} \
        --username ${username} \
        --user-attributes Name=email,Value=${email} Name=email_verified,Value=true \
        --message-action SUPPRESS \
        --endpoint-url ${ENDPOINT_URL}
}

set_admin_user_password() {
    local user_pool_id=$1
    local username=$2

    awslocal cognito-idp admin-set-user-password \
        --user-pool-id ${user_pool_id} \
        --username ${username} \
        --password ${COGNITO_USER_PASSWORD} \
        --permanent \
        --endpoint-url ${ENDPOINT_URL}
}

# main

USER_POOL_ID=$(awslocal cognito-idp list-user-pools --max-results 1 \
    --endpoint-url $ENDPOINT_URL \
    --query 'UserPools[0].Id' \
    --output text) || error_exit "ユーザープール ID の取得に失敗しました"

if [ "$USER_POOL_ID" = "None" ]; then
    echo "❌ Error: ユーザープールが見つかりませんでした"
    exit 1
fi

apt -y update && apt -y install jq

awslocal dynamodb batch-write-item \
    --request-items "file://${JSON_FILE}" || error_exit "DynamoDB へのユーザー登録に失敗しました"

jq -c '.user[]' "$JSON_FILE" | while read -r user_json; do
    USER_ID=$(echo "$user_json" | jq -r '.PutRequest.Item.id.S')
    USER_EMAIL=$(echo "$user_json" | jq -r '.PutRequest.Item.email.S')

    create_admin_user $USER_POOL_ID $USER_ID $USER_EMAIL || error_exit "ユーザーの作成に失敗しました ($USER_ID)"
    set_admin_user_password $USER_POOL_ID $USER_ID || error_exit "パスワードの設定に失敗しました ($USER_ID)"
done
