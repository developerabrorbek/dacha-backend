import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_AUTH_KEY } from '@decorators';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAuth = this.reflector.getAllAndOverride<string>(CHECK_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(isAuth, "auth")
    const request = context.switchToHttp().getRequest<Request>();
    console.log(request.headers.authorization)
    return true
  }
}
