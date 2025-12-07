import { App } from "aws-cdk-lib";

interface StringValues {
  [key: string]: string;
}

export interface AppEnv extends StringValues {
  BUCKET_NAME: string;
  SENDER_EMAIL: string;
  AWS_ENDPOINT: string;
  OPENSEARCH_ENDPOINT: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_AUTH_USER: string;
  MAIL_AUTH_PASSWORD: string;
}

export function getAppEnv(app: App): AppEnv {
  const vals = app.node.tryGetContext("localEnv");
  if (!vals) {
    throw new Error("Context not found: env vals");
  }

  return vals;
}
