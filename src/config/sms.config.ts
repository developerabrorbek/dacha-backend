import { registerAs } from '@nestjs/config';

declare interface SmsConfigOptions {
  password: string;
  username: string;
}

export const smsConfig = registerAs<SmsConfigOptions>(
  'sms',
  (): SmsConfigOptions => ({
    password: process.env.SMS_PASSWORD,
    username: process.env.SMS_USERNAME,
  }),
);
