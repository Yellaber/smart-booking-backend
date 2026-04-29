import { ApiProperty } from '@nestjs/swagger';

export class AssessmentResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The unique identifier of the assessment.',
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        example: 4,
        description: 'The rating given in the assessment. It must be between 1 and 5.',
        format: 'number'
    })
    rating: number;

    @ApiProperty({
        example: 'Great service!',
        description: 'An optional comment about the assessment. It must have a maximum length of 255 characters.',
        format: 'string'
    })
    comment?: string;
}