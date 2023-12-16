import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PrismaService } from 'prisma/prisma.service';
import { Permissionservice } from './permission.service';

@Module({
  controllers: [PermissionController],
  providers: [PrismaService,Permissionservice],
})
export class PermissionModule {}
