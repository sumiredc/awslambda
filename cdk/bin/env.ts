import { App } from "aws-cdk-lib";

export interface AppEnv {
  env: string;
  bucketName: string;
}

export function getAppEnv(app: App): AppEnv {
  const key = app.node.tryGetContext("env");
  if (!key) {
    throw new Error("Context not found: env key");
  }

  const vals = app.node.tryGetContext(key);
  if (!vals) {
    throw new Error("Context not found: env vals");
  }

  return vals;
}
