import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import {
  MinioRemoveObjectRequest,
  MinioUploadRequest,
  MinioUploadResponse,
} from './interfaces';
import * as sharp from 'sharp';
import { randomUUID } from 'crypto';

@Injectable()
export class MinioService {
  readonly #_client: Client;
  constructor(config: ConfigService) {
    this.#_client = new Client({
      endPoint: config.getOrThrow<string>('minio.endPoint'),
      accessKey: config.getOrThrow<string>('minio.accessKey'),
      secretKey: config.getOrThrow<string>('minio.secretKey'),
      useSSL: true,
      port: config.getOrThrow<number>('minio.port'),
    });
  }

  async uploadImage(payload: MinioUploadRequest): Promise<MinioUploadResponse> {
    try {
      const file = Buffer.from(payload.file, 'base64');
      const { format } = await sharp(file).metadata();
      const objectName = randomUUID();
      const res = await this.#_client.putObject(
        payload.bucket,
        `/${objectName}.${format}`,
        file,
      );

      if (!res.etag)
        throw new InternalServerErrorException('Error while uploading image');
      return {
        image: `/${objectName}.${format}`,
      };
    } catch (error) {
      console.log(error)
      throw new ConflictException('Error on uploading image');
    }
  }

  async removeObject(payload: MinioRemoveObjectRequest): Promise<void> {
    try {
      await this.#_client.removeObject(payload.bucket, payload.objectName);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error while deleting object',
      );
    }
  }
}
