import { Controller, Delete, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  #_service: AuthService;

  constructor(service: AuthService){
    this.#_service = service;
  }

  @Post("/login")
  async login(): Promise<void>{
    await this.#_service.login()
  }

  @Post("/register")
  async register(): Promise<void>{
    await this.#_service.register()
  }

  @Post("/refresh")
  async refresh(): Promise<void>{
    await this.#_service.refresh()
  }

  @Delete("/logout")
  async logout(): Promise<void>{
    await this.#_service.logout()
  }
}