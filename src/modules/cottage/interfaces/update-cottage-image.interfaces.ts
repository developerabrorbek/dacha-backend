import { MainImage, Status } from '@prisma/client';

export declare interface UpdateCottageImageRequest {
  id: string;
  mainImage?: MainImage;
  status?: Status;
}
