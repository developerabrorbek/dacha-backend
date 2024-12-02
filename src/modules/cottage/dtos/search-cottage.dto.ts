import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchCottageListDto {
    @ApiProperty({
        type: "string",
        required: false,
        example: "Bochka"
    })
    @IsOptional()
    @IsString()
    name?: string;
}