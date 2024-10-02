import { registerAs } from "@nestjs/config";

declare interface AppConfigOptions {
  port: number
  host: string
}

export const appConfig = registerAs<AppConfigOptions>(
  'app',
  (): AppConfigOptions => ({
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST,
  }),
);