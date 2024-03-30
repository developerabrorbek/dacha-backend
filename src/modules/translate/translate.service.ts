import { PrismaService } from '@prisma';
import { Translate } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import {
  CreateTranslateInterface,
  GetSingleTranslateRequest,
  GetSingleTranslateResponse,
  UpdateTranslateRequest,
} from './interfaces';

@Injectable()
export class TranslateService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getTranslateList(): Promise<Translate[]> {
    return await this.#_prisma.translate.findMany({
      include: {
        definition: {
          select: {
            value: true,
            language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async getUnusedTranslateList(): Promise<Translate[]> {
    return await this.#_prisma.translate.findMany({
      where: {
        status: 'inactive',
      },
      include: {
        definition: {
          select: {
            value: true,
            language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async createTranslate(payload: CreateTranslateInterface): Promise<void> {
    await this.#_checkExistingTranslate(payload.code);

    for (const code of Object.keys(payload.definition)) {
      await this.#_checkLanguage(code);
    }

    const translate = await this.#_prisma.translate.create({
      data: { code: payload.code, type: payload.type, status: 'inactive' },
    });

    for (const item of Object.entries(payload.definition)) {
      const language = await this.#_prisma.language.findFirst({
        where: { code: item[0] },
      });

      await this.#_prisma.definition.create({
        data: {
          languageId: language.id,
          translateId: translate.id,
          value: item[1],
        },
      });
    }
  }

  async getSingleTranslate(
    payload: GetSingleTranslateRequest,
  ): Promise<GetSingleTranslateResponse> {
    await this.#_checkLanguage(payload.languageCode);
    await this.#_checkTranslate(payload.translateId);

    const language = await this.#_prisma.language.findFirst({
      where: { code: payload.languageCode },
      select: {
        id: true,
      },
    });

    const translate = await this.#_prisma.translate.findFirst({
      where: { id: payload.translateId },
      select: {
        id: true,
      },
    });

    const definition = await this.#_prisma.definition.findFirst({
      where: {
        languageId: language.id,
        translateId: translate.id,
      },
      select: {
        value: true,
      },
    });

    return {
      value: definition?.value || '',
    };
  }

  async updateTranslate(payload: UpdateTranslateRequest): Promise<void> {
    await this.#_checkTranslate(payload.id);
    const foundedTranslate = await this.#_prisma.translate.findFirst({
      where: { id: payload.id },
    });

    if (payload?.status) {
      if (payload.status == 'active' && foundedTranslate.status == 'active') {
        throw new ConflictException('Translate is already in use');
      }

      await this.#_prisma.translate.update({
        where: { id: payload.id },
        data: { status: payload.status },
      });
    }

    if(payload?.definition){
      await this.#_prisma.definition.deleteMany({where: {translateId: foundedTranslate.id}})

      for (const item of Object.entries(payload.definition)) {
        const language = await this.#_prisma.language.findFirst({
          where: { code: item[0] },
        });
  
        await this.#_prisma.definition.create({
          data: {
            languageId: language.id,
            translateId: foundedTranslate.id,
            value: item[1],
          },
        });
      }
    }
  }

  async deleteTranslate(id: string) {
    await this.#_checkUUID(id);

    await this.#_prisma.translate.delete({
      where: { id },
      include: {
        definition: true,
      },
    });
  }

  async #_checkLanguage(code: string): Promise<void> {
    const language = await this.#_prisma.language.findFirst({
      where: { code },
    });

    if (!language) throw new ConflictException(`Language ${code} not found`);
  }

  async #_checkTranslate(id: string): Promise<void> {
    await this.#_checkUUID(id);
    const translate = await this.#_prisma.translate.findFirst({
      where: { id },
    });

    if (!translate) throw new NotFoundException('Translate not found');
  }

  async #_checkExistingTranslate(code: string): Promise<void> {
    const translate = await this.#_prisma.translate.findFirst({
      where: { code },
    });

    if (translate)
      throw new BadRequestException(`Translate ${code} is already available`);
  }

  async #_checkUUID(id: string): Promise<void> {
    if (!isUUID(id, 4))
      throw new BadRequestException(`${id} is not valid UUID`);
  }
}
