import { App } from "aws-cdk-lib";
import { config } from "dotenv";

export function loadEnv(app: App) {
  let path = ".env";
  const env = app.node.tryGetContext("env");
  if (env) {
    path += `.${env}`;
  }

  config({ path });
}
