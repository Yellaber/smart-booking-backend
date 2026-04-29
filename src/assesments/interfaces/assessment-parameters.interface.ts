import { PaginationDto } from '../../common/dtos/pagination.dto';
import { User } from '../../users/entities/user.entity';
import { CreateAssessmentDto, UpdateAssessmentDto } from '../dto';

export interface AssessmentParameters {
    branchId: string;
    userId: string;
    authenticatedUser: User;
    assessmentId?: string;
    paginationDto?: PaginationDto;
    createAssessmentDto?: CreateAssessmentDto;
    updateAssessmentDto?: UpdateAssessmentDto;
}