import { CottageEventType } from "@prisma/client";

export declare interface AddCottageEventRequest {
    cottageId: string;
    event: CottageEventType
}