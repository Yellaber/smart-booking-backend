import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserRole } from '../common/enums';
import { User } from '../users/entities/user.entity';
import { CreateSpecialistDto, PaginationSpecialistResponseDto, SpecialistResponseDto } from './dto';
import { SpecialistsService } from './specialists.service';

@Controller('branches/:branchId/specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiResponse({ status: 201, description: 'Specialist created successfully.', type: SpecialistResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request. The user provided is not a specialist.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  create(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() createSpecialistDto: CreateSpecialistDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.create(branchId, createSpecialistDto, authenticatedUser);
  }

  @Get()
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of specialists to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of specialists to skip.' })
  @ApiResponse({ status: 200, description: 'Specialists retrieved successfully.', type: PaginationSpecialistResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAll(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.findAll(branchId, paginationDto, authenticatedUser);
  }

  @Get(':specialistId')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiResponse({ status: 200, description: 'ID of the specialist to retrieve (UUID).', type: SpecialistResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or specialist not found.' })
  findOne(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.findOneSpecialistResponse(branchId, specialistId, authenticatedUser);
  }

  @Patch(':specialistId/status')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist to update status (UUID).' })
  @ApiResponse({ status: 200, description: 'Specialist updated successfully.', type: SpecialistResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or specialist not found.' })
  update(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.status(branchId, specialistId, authenticatedUser);
  }
}
