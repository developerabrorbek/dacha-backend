import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  UnprocessableEntityException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@decorators';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

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
      include: {
        permissions: {
          select: {
            permission: {
              select: {
                code: true,
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!userRole) {
      throw new UnauthorizedException('User role not found');
    }

    const foundedPermission = await this.prisma.permission.findFirst({
      where: { code: permission },
    });

    if (!foundedPermission) {
      throw new InternalServerErrorException(
        'There is no permission like that',
      );
    }

    if (
      userRole.permissions.some((p) => p.permission.id == foundedPermission.id)
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<any>();

    const token = request.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      throw new UnprocessableEntityException('Please provide a token');
    }

    const accessToken = token.replace('Bearer ', '');

    const userData = this.jwt.verify(accessToken, {
      secret: this.config.getOrThrow<string>('jwt.accessKey'),
    });

    const userRoles = await this.prisma.user_Role.findMany({
      where: { userId: userData?.id },
    });

    let isHavePermission = false;

    for (const role of userRoles) {
      const foundedRole = await this.prisma.role.findFirst({
        where: { id: role.roleId },
        include: {
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (
        foundedRole?.permissions?.some(
          (p) => p.permission.id == foundedPermission.id,
        )
      ) {
        isHavePermission = true;
      }
    }

    if (!isHavePermission) {
      throw new ConflictException('User has no permission to do that');
    }

    return isHavePermission;
  }
}
