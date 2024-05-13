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

    const smsCode = String(Math.floor(Math.random() * 90000) + 10000);

    await this.#_sendSms({ phone: payload.phone, smsCode });

    const expireSmsTime = String(new Date().getTime() + SMS_EXPIRE_TIME * 1000);

    await this.#_prisma.user.update({
      where: { id: userId },
      data: {
        smsCode,
        smsExpireTime: expireSmsTime,
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
    });

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    const currentTime = new Date().getTime();

    if (Number(foundedUser.smsExpireTime) - currentTime < 0) {
      throw new UnprocessableEntityException('Sms Code already expired');
    }

    const foundedUserDevice = await this.#_prisma.userDevice.findFirst({
      where: {
        userId: payload.userId,
        userAgent: payload.userAgent,
        ip: payload.ip,
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
        },
      });

      return {
        accessToken,
        refreshToken,
        user: foundedUser,
      };
    }

    await this.#_prisma.userDevice.create({
      data: {
        accessToken,
        refreshToken,
        userId: payload.userId,
        userAgent: payload.userAgent,
        ip: payload.ip,
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

    const foundedUserDevice = await this.#_prisma.userDevice.findFirst({
      where: {
        userId: foundedUser.id,
        userAgent: payload.userAgent,
        ip: payload.ip,
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
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    }

    await this.#_prisma.userDevice.create({
      data: {
        accessToken,
        refreshToken,
        userId: foundedUser.id,
        userAgent: payload.userAgent,
        ip: payload.ip,
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

      const data = await this.#_jwt.verifyAsync(payload.refreshToken, {
        secret: this.#_config.getOrThrow<string>('jwt.refreshKey'),
      });

      const userDevice = await this.#_prisma.userDevice.findFirst({
        where: { ip: payload.ip, userAgent: payload.userAgent },
      });

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

    const message = `Sizning Dachi v gorax sayti uchun tasdiqlash kodingiz: ${payload.smsCode}`

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
