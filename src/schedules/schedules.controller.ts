import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserRole } from '../common/enums';
import { User } from '../users/entities/user.entity';
import { CreateScheduleDto, PaginationScheduleResponseDto, ScheduleResponseDto } from './dto';
import { SchedulesService } from './schedules.service';

@Controller('specialists')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post(':specialistId/schedules')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully.', type: ScheduleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  create(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.create(specialistId, createScheduleDto, authenticatedUser);
  }

  @Get(':specialistId/schedules')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of schedules to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of schedules to skip.' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully.', type: PaginationScheduleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  findAll(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.findAll(specialistId, paginationDto, authenticatedUser);
  }

  @Get(':specialistId/schedules/:scheduleId')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiParam({ name: 'scheduleId', description: 'ID of the schedule to retrieve (UUID).' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully.', type: ScheduleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule not found.' })
  findOneById(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.findOneSheduleResponseById(specialistId, scheduleId, authenticatedUser);
  }

  @Delete(':specialistId/schedules/:scheduleId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiParam({ name: 'scheduleId', description: 'ID of the schedule to remove (UUID).' })
  @ApiResponse({ status: 200, description: 'Schedule removed successfully.', type: ScheduleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule not found.' })
  remove(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.remove(specialistId, scheduleId, authenticatedUser);
  }
}
