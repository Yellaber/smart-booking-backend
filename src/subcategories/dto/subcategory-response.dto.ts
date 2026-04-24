import { ApiProperty } from '@nestjs/swagger';

export class SubCategoryResponseDto {
    @ApiProperty({
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "The unique identifier of the subcategory",
        format: "uuid"
    })
    id: string = '';

    @ApiProperty({
        example: "Example Subcategory",
        description: "The name of the subcategory"
    })
    name: string = '';
}