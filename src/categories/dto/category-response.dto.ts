import { ApiProperty } from '@nestjs/swagger';
import { SubCategoryResponseDto } from '../../subcategories/dto/subcategory-response.dto';

export class CategoryResponseDto {
    @ApiProperty({
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "The unique identifier of the category",
        format: "uuid"
    })
    id: string = '';

    @ApiProperty({
        example: "arte corporal",
        description: "The name of the category",
        format: "string"
    })
    name: string = '';

    @ApiProperty({
        example: [
            {
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "tatuajes"
            }
        ],
        description: "The subcategories of the category",
        type: [ SubCategoryResponseDto ]
    })
    subCategories: SubCategoryResponseDto[] = [];
}