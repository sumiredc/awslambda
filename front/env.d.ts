declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: string;
        VITE_APP_API_ID: string;
        VITE_APP_API_STAGE_NAME: string;
      }
    }
  }
}
