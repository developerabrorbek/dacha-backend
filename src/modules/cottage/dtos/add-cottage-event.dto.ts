import { $Enums } from "@prisma/client";
import { AddCottageEventRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";

export class AddCottageEventDto implements AddCottageEventRequest {
    @ApiProperty({
        type: "string",
        required: true,
    })
    @IsUUID(4)
    cottageId: string;

    @ApiProperty({
        enum: $Enums.CottageEventType,
        required: true,
    })
    @IsEnum($Enums.CottageEventType)
    event: $Enums.CottageEventType;
}