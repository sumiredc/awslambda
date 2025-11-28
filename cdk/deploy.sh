# !/bin/sh

npm run build
npx cdklocal destroy APIGatewayStack
npx cdklocal deploy --all --require-approval never
