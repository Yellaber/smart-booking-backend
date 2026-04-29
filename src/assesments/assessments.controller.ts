import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserRole } from '../common/enums';
import { User } from '../users/entities/user.entity';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto, PaginationAssessmentResponseDto, UpdateAssessmentDto } from './dto';
import { AssessmentResponseDto } from './dto/assessment-response.dto';

@Controller('branches/:branchId/users/:userId/assessments')
@Auth(UserRole.CUSTOMER, UserRole.SUPER_USER)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'userId', description: 'ID of the user (UUID).' })
  @ApiResponse({ status: 201, description: 'The assessment has been created successfully.', type: AssessmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or user not found.' })
  create(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createAssessmentDto: CreateAssessmentDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.assessmentsService.create({ branchId, userId, createAssessmentDto, authenticatedUser });
  }

  @Get()
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'userId', description: 'ID of the user (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of assessments to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of assessments to skip.' })
  @ApiResponse({ status: 200, description: 'Assessments retrieved successfully.', type: PaginationAssessmentResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or user not found.' })
  findAll(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.assessmentsService.findAll({ branchId, userId, paginationDto, authenticatedUser });
  }

  @Get(':assessmentId')
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'userId', description: 'ID of the user (UUID).' })
  @ApiParam({ name: 'assessmentId', description: 'ID of the assessment (UUID).' })
  @ApiResponse({ status: 200, description: 'Assessment retrieved successfully.', type: AssessmentResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch, user or assessment not found.' })
  findOneById(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.assessmentsService.findOneById({ branchId, userId, assessmentId, authenticatedUser });
  }

  @Patch(':assessmentId')
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'userId', description: 'ID of the user (UUID).' })
  @ApiParam({ name: 'assessmentId', description: 'ID of the assessment (UUID).' })
  @ApiResponse({ status: 200, description: 'Assessment updated successfully.', type: AssessmentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch, user or assessment not found.' })
  update(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.assessmentsService.update({ branchId, userId, assessmentId, authenticatedUser, updateAssessmentDto });
  }

  @Delete(':assessmentId')
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'userId', description: 'ID of the user (UUID).' })
  @ApiParam({ name: 'assessmentId', description: 'ID of the assessment (UUID).' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch, user or assessment not found.' })
  remove(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.assessmentsService.remove({ branchId, userId, authenticatedUser, assessmentId });
  }
}
