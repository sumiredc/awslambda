declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: string;
        BUCKET_NAME: string;
        SENDER_EMAIL: string;
        AWS_ENDPOINT: string;
        OPENSEARCH_ENDPOINT: string;
        MAIL_HOST: string;
        MAIL_PORT: string;
        MAIL_AUTH_USER: string;
        MAIL_AUTH_PASSWORD: string;
        COGNITO_USER_POOL_CLIENT_ID: string;
      }
    }
  }
}
