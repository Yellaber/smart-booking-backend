import { ApiProperty } from '@nestjs/swagger';
import { AssessmentResponseDto } from './assessment-response.dto';

export class PaginationAssessmentResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of assessments',
        format: 'number'
    })
    total: number = 0;

    @ApiProperty({
        example: [
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                vote: 4,
                comment: 'Great service!'
            }
        ],
        type: [ AssessmentResponseDto ],
        description: 'List of assessments in the current page.',
    })
    assessments: AssessmentResponseDto[] = [];
}