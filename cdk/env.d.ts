declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv extends AppEnv {
        NODE_ENV?: string;
        BUCKET_NAME: string;
        SENDER_EMAIL: string;
      }
    }
  }
}
