import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateAssessmentDto {
    @ApiProperty({
        example: 4.0,
        description: 'The rating given in the assessment. It must be between 1 and 5.',
        format: 'number'
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        example: 'Great service!',
        description: 'An optional comment about the assessment. It must have a maximum length of 255 characters.',
        format: 'string'
    })
    @IsString()
    @MaxLength(255)
    @IsOptional()
    comment?: string;
}
