import { CottageOnTariffStatus, Status } from "@prisma/client";

export declare interface DisableTariffRequest {
  id: string;
  status?: Status;
  tariffStatus?: CottageOnTariffStatus
}