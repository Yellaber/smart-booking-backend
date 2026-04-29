import { PaginationAssessmentResponseDto } from '../dto';
import { AssessmentResponseDto } from '../dto/assessment-response.dto';
import { Assessment } from '../entities/assessment.entity';

export class AssessmentResponse {
    static get(assessment: Assessment): AssessmentResponseDto {
        const { id, rating, comment } = assessment;
        return { id, rating, comment };
    }

    static getPagination(total: number, assessments: Assessment[]): PaginationAssessmentResponseDto {
        const assessmentsResponse = assessments.map(assessment => this.get(assessment));
        return { total, assessments: assessmentsResponse };
    }
}