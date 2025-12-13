# !/bin/sh
rm -rf cdk.out dist

npm install
npm run build

export $(cat .env | xargs)

npx cdklocal bootstrap
npx cdklocal deploy --all --require-approval never -y
