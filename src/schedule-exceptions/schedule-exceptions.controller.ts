import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleExceptionDto, PaginationScheduleExceptionResponseDto, ScheduleExceptionResponseDto } from './dto';
import { ScheduleExceptionsService } from './schedule-exceptions.service';

@Controller('specialists')
export class ScheduleExceptionsController {
  constructor(private readonly scheduleExceptionsService: ScheduleExceptionsService) {}

  @Post(':specialistId/schedule-exceptions')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiResponse({ status: 201, description: 'ScheduleException created successfully.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  create(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Body() createScheduleExceptionDto: CreateScheduleExceptionDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.create(specialistId, createScheduleExceptionDto, authenticatedUser);
  }

  @Get('me/schedule-exceptions')
  @Auth(UserRole.SPECIALIST)
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of schedule exceptions to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of schedule exceptions to skip.' })
  @ApiResponse({ status: 200, description: 'Schedule exceptions retrieved successfully for the authenticated specialist.', 
                 type: PaginationScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  findAllByMe(
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.findAllByMe(paginationDto, authenticatedUser);
  }

  @Get(':specialistId/schedule-exceptions')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
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

  @Get(':specialistId/schedule-exceptions/:scheduleExceptionId')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiParam({ name: 'scheduleExceptionId', description: 'ID of the schedule exception to retrieve (UUID).' })
  @ApiResponse({ status: 200, description: 'Schedule exception retrieved successfully.', type: ScheduleExceptionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule exception not found.' })
  findOneById(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('scheduleExceptionId', ParseUUIDPipe) scheduleExceptionId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.findOneScheduleExceptionResponseById(specialistId, scheduleExceptionId, authenticatedUser);
  }

  @Delete(':specialistId/schedule-exceptions/:scheduleExceptionId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiParam({ name: 'scheduleExceptionId', description: 'ID of the schedule exception to remove (UUID).' })
  @ApiResponse({ status: 200, description: 'Schedule exception removed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule exception not found.' })
  remove(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('scheduleExceptionId', ParseUUIDPipe) scheduleExceptionId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.scheduleExceptionsService.remove(specialistId, scheduleExceptionId, authenticatedUser);
  }
}
