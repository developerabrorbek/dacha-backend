import { Status } from '@prisma/client';

export declare interface UpdateCottageImageRequest {
  id: string;
  image?: string;
  status?: Status;
}
