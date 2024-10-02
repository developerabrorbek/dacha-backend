import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import {
  LoginForAdminRequest,
  LoginForAdminResponse,
  LoginGetSMSCodeRequest,
  LoginGetSMSCodeResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
  SendSMSRequest,
} from './interfaces';
import {
  JWT_ACCESS_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME,
  SMS_EXPIRE_TIME,
} from '@constants';
import { ConfigService } from '@nestjs/config';
import { isJWT } from 'class-validator';
import { UAParser, UAParserInstance } from 'ua-parser-js';

@Injectable()
export class AuthService {
  #_prisma: PrismaService;
  #_jwt: JwtService;
  #_config: ConfigService;

  constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService) {
    this.#_prisma = prisma;
    this.#_jwt = jwt;
    this.#_config = config;
  }

  async loginGetSms(
    payload: LoginGetSMSCodeRequest,
  ): Promise<LoginGetSMSCodeResponse> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { phone: payload.phone },
    });

    let userId = null;

    if (foundedUser) {
      userId = foundedUser.id;
    }

    if (!foundedUser) {
      const newUser = await this.#_prisma.user.create({
        data: { phone: payload.phone },
      });
      userId = newUser.id;
    }

    // generate 5 digits unique code for otp
    const smsCode = String(Math.floor(Math.random() * 90000) + 10000);

    // Send otp code to user phone
    await this.#_sendSms({ phone: payload.phone, smsCode });

    const expireSmsTime = new Date(new Date().getTime() + SMS_EXPIRE_TIME * 1000);

    await this.#_prisma.user_Otp.create({
      data: {
        otp: smsCode,
        expiresAt: expireSmsTime,
        userId: userId,
      },
    });

    return {
      expireTime: SMS_EXPIRE_TIME,
      userId: userId,
      smsCode,
    };
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { id: payload.userId },
      include: {
        userOtps: {
          select: {
            expiresAt: true,
            id: true,
            isUsed: true,
            otp: true,
          },
        },
      },
    });

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    const currentTime = new Date().getTime();

    // Found match OTP for user login
    const matchOtp = foundedUser.userOtps.find(
      (otp) =>
        otp.otp == payload.smsCode &&
        otp.isUsed == false &&
        Number(otp.expiresAt) - currentTime < 0,
    );

    if (!matchOtp) {
      throw new UnprocessableEntityException(
        'Sms Code already expired or used. Try another one',
      );
    }

    // update user match OTP as used
    await this.#_prisma.user_Otp.update({
      where: { id: matchOtp.id },
      data: {
        isUsed: true,
      },
    });

    // Parse user agent string
    const userAgent: UAParserInstance = new UAParser(payload.userAgent);

    const foundedUserDevice = await this.#_prisma.userDevice.findFirst({
      where: {
        userId: payload.userId,
        deviceId: payload.ip,
        OR: [
          { deviceName: userAgent.getDevice().model },
          { deviceType: userAgent.getDevice().type },
        ],
        platform: userAgent.getOS().name,
      },
    });

    const accessToken = this.#_jwt.sign(
      { id: foundedUser.id },
      {
        secret: this.#_config.getOrThrow<string>('jwt.accessKey'),
        expiresIn: JWT_ACCESS_EXPIRE_TIME,
      },
    );
    const refreshToken = this.#_jwt.sign(
      { id: foundedUser.id },
      {
        secret: this.#_config.getOrThrow<string>('jwt.refreshKey'),
        expiresIn: JWT_REFRESH_EXPIRE_TIME,
      },
    );

    if (foundedUserDevice) {
      await this.#_prisma.userDevice.update({
        where: { id: foundedUserDevice.id },
        data: {
          accessToken,
          refreshToken,
          isActive: true,
          lastLogin: new Date(),
          tokenExpireAt: new Date(Date.now() + Number(JWT_ACCESS_EXPIRE_TIME)),
        },
      });
    }

    await this.#_prisma.userDevice.create({
      data: {
        accessToken,
        refreshToken,
        userId: payload.userId,
        isActive: true,
        lastLogin: new Date(),
        deviceId: payload.ip,
        deviceName: userAgent.getDevice()?.model || "device",
        deviceType: userAgent.getDevice()?.type || "device",
        platform: userAgent.getOS().name,
        tokenExpireAt: new Date(Date.now() + Number(JWT_ACCESS_EXPIRE_TIME)),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: foundedUser,
    };
  }

  async loginForAdmin(
    payload: LoginForAdminRequest,
  ): Promise<LoginForAdminResponse> {
    const foundedUser = await this.#_prisma.user.findFirst({
      where: { password: payload.password, username: payload.username },
    });

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    // Parse user agent string
    const userAgent: UAParserInstance = new UAParser(payload.userAgent);

    const foundedUserDevice = await this.#_prisma.userDevice.findFirst({
      where: {
        userId: foundedUser.id,
        deviceId: payload.ip,
        OR: [
          { deviceName: userAgent.getDevice().model },
          { deviceType: userAgent.getDevice().type },
        ],
        platform: userAgent.getOS().name,
      },
    });

    const accessToken = this.#_jwt.sign(
      { id: foundedUser.id },
      {
        secret: this.#_config.getOrThrow<string>('jwt.accessKey'),
        expiresIn: JWT_ACCESS_EXPIRE_TIME,
      },
    );
    const refreshToken = this.#_jwt.sign(
      { id: foundedUser.id },
      {
        secret: this.#_config.getOrThrow<string>('jwt.refreshKey'),
        expiresIn: JWT_REFRESH_EXPIRE_TIME,
      },
    );

    if (foundedUserDevice) {
      await this.#_prisma.userDevice.update({
        where: { id: foundedUserDevice.id },
        data: {
          accessToken,
          refreshToken,
          isActive: true,
          lastLogin: new Date(),
          tokenExpireAt: new Date(Date.now() + Number(JWT_ACCESS_EXPIRE_TIME)),
        },
      });
    }

    await this.#_prisma.userDevice.create({
      data: {
        accessToken,
        refreshToken,
        userId: foundedUser.id,
        isActive: true,
        lastLogin: new Date(),
        deviceId: payload.ip,
        deviceName: userAgent.getDevice()?.model || "desktop",
        deviceType: userAgent.getDevice()?.type || "desktop",
        platform: userAgent.getOS().name,
        tokenExpireAt: new Date(Date.now() + Number(JWT_ACCESS_EXPIRE_TIME)),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(payload: RefreshRequest): Promise<RefreshResponse> {
    try {
      if (!isJWT(payload.refreshToken)) {
        throw new UnprocessableEntityException('Invalid token');
      }

      // Verify if refresh token is valid and not expired
      const data = await this.#_jwt.verifyAsync(payload.refreshToken, {
        secret: this.#_config.getOrThrow<string>('jwt.refreshKey'),
      });

      // Found users device
      const userDevice = await this.#_prisma.userDevice.findFirst({
        where: { deviceId: payload.ip, refreshToken: payload.refreshToken },
      });

      if (!userDevice) {
        throw new NotFoundException('User device not found');
      }

      const accessToken = this.#_jwt.sign(
        { id: data.id },
        { secret: this.#_config.getOrThrow<string>('jwt.accessKey') },
      );
      const refreshToken = this.#_jwt.sign(
        { id: data.id },
        { secret: this.#_config.getOrThrow<string>('jwt.refreshKey') },
      );

      await this.#_prisma.userDevice.update({
        where: { id: userDevice.id },
        data: {
          accessToken,
          refreshToken,
          lastLogin: new Date(),
          isActive: true,
          tokenExpireAt: new Date(Date.now() + Number(JWT_ACCESS_EXPIRE_TIME)),
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpException(err.message, 455);
      }
      throw new ForbiddenException('Refresh token error');
    }
  }

  async logout(payload: LogoutRequest): Promise<void> {
    const accessToken = payload.accessToken.split('Bearer ')[1];
    // Check access token
    if (!isJWT(accessToken)) {
      throw new UnprocessableEntityException('Invalid token');
    }

    const userDevice = await this.#_prisma.userDevice.findFirst({
      where: { accessToken: accessToken },
    });

    if (!userDevice) {
      throw new NotFoundException('User device not found');
    }

    await this.#_prisma.userDevice.update({
      where: { id: userDevice.id },
      data: {
        accessToken: null,
        refreshToken: null,
        isActive: false,
        tokenExpireAt: null,
      },
    });
  }

  async #_sendSms(payload: SendSMSRequest): Promise<any> {
    // const myHeaders = new Headers();
    // myHeaders.append(
    //   'Authorization',
    //   'App 53006856e580728eba1da7cd3f11ce58-3e9f8ccf-6c3b-426b-a398-cc89ba3b4a93',
    // );
    // myHeaders.append('Content-Type', 'application/json');
    // myHeaders.append('Accept', 'application/json');

    // const raw = JSON.stringify({
    //   messages: [
    //     {
    //       destinations: [{ to: `998${payload.phone}` }],
    //       from: 'ServiceSMS',
    //       text: `Assalomu alaykum, sizning dacha v gorax ga kirish kodingiz: ${payload.smsCode}`,
    //     },
    //   ],
    // });
    let result = null;

    const message = `Sizning Dachi v gorax sayti uchun tasdiqlash kodingiz: ${payload.smsCode} \n\n Your confirmation code for Dachi v gorax site: ${payload.smsCode} \n\n Ваш код подтверждения для сайта «Дачи в горах»: ${payload.smsCode}
    `;

    fetch(
      `http://94.158.52.192/api/husanboy_ytt/sendsms.php?username=HusanboyYTT&password=5ddfb54b7a39cd782a37f3f493051509e9a8fb2d&id=MESSSAGE_ID&from=SMSINFO&to=998${payload.phone}&text=${message}&coding=Dachivgorax`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.text())
      .then((res) => (result = res))
      .catch((error) => console.log('error', error));
    return result;
  }
}
