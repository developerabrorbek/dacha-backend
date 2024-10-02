
import { registerAs } from '@nestjs/config';

declare interface AppConfigOptions {
  port: number;
  host: string;
}

export const appConfig = registerAs<AppConfigOptions>(
  'appConfig',
  (): AppConfigOptions => ({
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT) || 1002,
  }),
);
