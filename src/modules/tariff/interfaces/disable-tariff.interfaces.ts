import { CottageOnTariffStatus, Status } from "@prisma/client";

export declare interface DisableTariffRequest {
  cottageId: string;
  tariffId: string;
  status?: Status;
  tariffStatus?: CottageOnTariffStatus
}