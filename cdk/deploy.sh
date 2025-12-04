# !/bin/sh

npm run build
npx cdklocal destroy APIGatewayStack -y
npx cdklocal deploy --all --require-approval never -y
