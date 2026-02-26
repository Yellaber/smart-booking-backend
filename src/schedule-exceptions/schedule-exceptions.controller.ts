import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleExceptionDto, PaginationScheduleExceptionResponseDto, ScheduleExceptionResponseDto, UpdateScheduleExceptionDto } from './dto';
import { ScheduleExceptionsService } from './schedule-exceptions.service';

@Controller('specialists')
export class ScheduleExceptionsController {
  constructor(private readonly scheduleExceptionsService: ScheduleExceptionsService) {}

  @Post('me/schedule-exceptions')
  @Auth(UserRole.SPECIALIST)
  @ApiResponse({ status: 201, description: 'Schedule exception created successfully for the authenticated specialist.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  createMyScheduleException(
    @Body() createScheduleExceptionDto: CreateScheduleExceptionDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.createMyScheduleException(createScheduleExceptionDto, authenticatedUser);
  }

  @Post(':specialistId/schedule-exceptions')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to create a schedule exception.' })
  @ApiResponse({ status: 201, description: 'ScheduleException created successfully.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  create(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Body() createScheduleExceptionDto: CreateScheduleExceptionDto
  ) {
    return this.scheduleExceptionsService.create(specialistId, createScheduleExceptionDto);
  }

  @Get('me/schedule-exceptions')
  @Auth(UserRole.SPECIALIST)
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of schedule exceptions to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of schedule exceptions to skip.' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions retrieved successfully for the authenticated specialist.', 
                 type: PaginationScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  findAllMyScheduleExceptions(
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.findAllMyScheduleExceptions(paginationDto, authenticatedUser);
  }

  @Get(':specialistId/schedule-exceptions')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to retrieve schedule exceptions.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of schedule exceptions to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of schedule exceptions to skip.' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions retrieved successfully.', type: PaginationScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  findAll(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.findAll(specialistId, paginationDto, authenticatedUser);
  }

  @Get(':specialistId/schedule-exceptions/:id')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to retrieve a schedule exception.' })
  @ApiParam({ name: 'id', description: 'Id of the schedule exception to retrieve.' })
  @ApiResponse({ status: 200, description: 'Schedule exception retrieved successfully.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule exception not found.' })
  findOne(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.findOneScheduleExceptionResponse(specialistId, id, authenticatedUser);
  }

  @Patch('me/schedule-exceptions/:id')
  @Auth(UserRole.SPECIALIST)
  @ApiParam({ name: 'id', description: 'Id of the schedule exception to update.' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions updated successfully for the authenticated specialist.', 
                 type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Schedule exception not found.' })
  updateMyScheduleException(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleExceptionDto: UpdateScheduleExceptionDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.updateMyScheduleException(id, updateScheduleExceptionDto, authenticatedUser);
  }

  @Patch(':specialistId/schedule-exceptions/:id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to update a schedule exception.' })
  @ApiParam({ name: 'id', description: 'Id of the schedule exception to update.' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions updated successfully.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule exception not found.' })
  update(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleExceptionDto: UpdateScheduleExceptionDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.update(specialistId, id, updateScheduleExceptionDto, authenticatedUser);
  }

  @Patch('me/schedule-exceptions/:id/status')
  @Auth(UserRole.SPECIALIST)
  @ApiParam({ name: 'id', description: 'Id of the schedule exception to update status.' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions updated successfully for the authenticated specialist.', 
                 type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Schedule exception not found.' })
  statusMyScheduleException(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.statusMyScheduleException(id, authenticatedUser);
  }

  @Patch(':specialistId/schedule-exceptions/:id/status')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to update status of a schedule exception.' })
  @ApiParam({ name: 'id', description: 'Id of the schedule exception to update.' })
  @ApiResponse({ status: 200, description: 'Status of the schedule exception updated successfully.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule exception not found.' })
  status(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.status(specialistId, id, authenticatedUser);
  }
}
