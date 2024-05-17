import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginForAdminDto, LoginGetSMSDto, RefreshDto } from './dtos';
import {
  LoginForAdminResponse,
  LoginGetSMSCodeResponse,
  LoginResponse,
  RefreshResponse,
} from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  #_service: AuthService;

  constructor(service: AuthService) {
    this.#_service = service;
  }

  @Post('/login')
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<LoginResponse> {
    return await this.#_service.login(payload, res);
  }

  @Post('/login/sms')
  async loginSms(
    @Body() payload: LoginGetSMSDto,
  ): Promise<LoginGetSMSCodeResponse> {
    return await this.#_service.loginGetSms(payload);
  }

  @Post('/login/admin')
  async loginForAdmin(
    @Body() payload: LoginForAdminDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<LoginForAdminResponse> {
    return await this.#_service.loginForAdmin(payload, res);
  }

  @Post('/refresh')
  async refresh(
    @Headers('refreshToken') refreshToken: string,
    @Body() payload: RefreshDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<RefreshResponse> {
    return await this.#_service.refresh({ refreshToken, ...payload }, res);
  }

  // @Delete('/logout')
  // async logout(): Promise<void> {
  //   await this.#_service.logout();
  // }
}
