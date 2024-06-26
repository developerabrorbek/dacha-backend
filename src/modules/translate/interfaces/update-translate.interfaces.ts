import { Status } from "@prisma/client";

export declare interface UpdateTranslateRequest {
  id: string;
  status?: Status;
  definition?: Record<string, string>
}