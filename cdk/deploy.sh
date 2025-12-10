# !/bin/sh

npm run build

npx cdklocal bootstrap
npx cdklocal deploy --all --require-approval never -y
