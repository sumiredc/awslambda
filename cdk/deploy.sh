# !/bin/sh

npm run build
npx cdklocal deploy --all --require-approval never
