import { PERMISSIONS } from '@constants';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '@prisma';
import { setInitialData } from './interfaces';

@Injectable()
export class SeedsService {
  #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async setInitialDate(payload: setInitialData): Promise<void> {
    try {
      // CHECK IF ALREADY INITIAL DATA WAS CREATED
      const models = await this.#_prisma.models.findMany();

      if (models.length) {
        throw new ConflictException('Initial data is already available');
      }

      // CHECK IF USER IS SUPER-ADMIN
      if (!(payload.username == 'abrorbek' && payload.password == 'abrorbek')) {
        throw new NotAcceptableException(
          "You do'nt not have permission to create data",
        );
      }

      // CREATE ALL MODELS WITH PERMISSIONS
      Object.entries(PERMISSIONS).forEach(async (model) => {
        const newModel = await this.#_prisma.models.create({
          data: {
            name: model[0],
          },
        });

        // CREATE MODEL PERMISSIONS
        Object.entries(model[1]).forEach(async (ds) => {
          await this.#_prisma.permission.create({
            data: {
              code: ds[1].name,
              name: ds[1].description,
              modelId: newModel.id,
            },
          });
        });
      });

      // CREATE USER ROLE
      await this.#_prisma.role.create({
        data: {
          name: 'USER',
        },
      });

      // CREATE SUPER-ADMIN ROLE
      const superAdminRole = await this.#_prisma.role.create({
        data: {
          name: 'SUPER-ADMIN',
        },
      });

      // SET ALL PERMISSIONS ON SUPER-ADMIN
      const allPermissions = await this.#_prisma.permission.findMany();

      allPermissions.forEach(async (p) => {
        await this.#_prisma.role_Permission.create({
          data: {
            permissionId: p.id,
            roleId: superAdminRole.id,
          },
        });
      });

      // CREATE DEFAULT SUPER-ADMIN USER
      const superAdminUser = await this.#_prisma.user.create({
        data: {
          phone: '939386462',
          password: 'abrorbek',
          username: 'abrorbek',
        },
      });

      await this.#_prisma.user_Role.create({
        data: {
          roleId: superAdminRole.id,
          userId: superAdminUser.id,
        },
      });
    } catch (error) {
      throw new ConflictException(
        error?.message || 'Error while creating initial data',
      );
    }
  }
}
