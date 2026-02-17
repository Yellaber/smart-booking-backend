import { Controller, Get, Post, Body, Patch, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleDto, PaginationScheduleResponseDto, ScheduleResponseDto, UpdateScheduleDto } from './dto';
import { SchedulesService } from './schedules.service';

@Controller('specialists')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post(':specialistId/schedules')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to create a schedule.' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully.', type: ScheduleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  create(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Body() createScheduleDto: CreateScheduleDto
  ) {
    return this.schedulesService.create(specialistId, createScheduleDto);
  }

  @Get('me/schedules')
  @Auth(UserRole.SPECIALIST)
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of schedules to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of schedules to skip.' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully for the authenticated specialist.', type: PaginationScheduleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist not found.' })
  findAllMySchedules(
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.findAllMySchedules(paginationDto, authenticatedUser);
  }

  @Get(':specialistId/schedules')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to retrieve schedules.' })
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

  @Get(':specialistId/schedules/:id')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to retrieve a schedule.' })
  @ApiParam({ name: 'id', description: 'Id of the schedule to retrieve.' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully.', type: ScheduleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule not found.' })
  findOne(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('id') id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.findOneSheduleResponse(specialistId, id, authenticatedUser);
  }

  @Patch(':specialistId/schedules/:id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to update a schedule.' })
  @ApiParam({ name: 'id', description: 'Id of the schedule to update.' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully.', type: ScheduleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule not found.' })
  update(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.update(specialistId, id, updateScheduleDto, authenticatedUser);
  }

  @Patch(':specialistId/schedules/:id/status')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'specialistId', description: 'Id of the specialist to update the status of a schedule.' })
  @ApiParam({ name: 'id', description: 'Id of the schedule to update the status.' })
  @ApiResponse({ status: 200, description: 'Schedule status updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Specialist or schedule not found.' })
  status(
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.schedulesService.status(specialistId, id, authenticatedUser);
  }
}
