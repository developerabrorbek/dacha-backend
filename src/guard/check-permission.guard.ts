import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@decorators';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      return true;
    }

    const userRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });
    const foundedPermission = await this.prisma.permission.findFirst({
      where: { code: permission },
    });

    if (!foundedPermission) {
      throw new InternalServerErrorException(
        'There is no permission like that',
      );
    }

    if (userRole?.permissions?.includes(foundedPermission?.id)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.headers.authorization.replace('Bearer ', '');

    const userData = this.jwt.verify(accessToken, {
      secret: this.config.getOrThrow<string>('jwt.accessKey'),
    });

    const userRoles = await this.prisma.userOnRole.findMany({
      where: { userId: userData?.id },
    });

    for (const role of userRoles) {
      const foundedRole = await this.prisma.role.findFirst({
        where: { id: role.roleId },
      });

      if (foundedRole?.permissions?.includes(foundedPermission.id)) {
        return true;
      }
    }

    return false;
  }
}
