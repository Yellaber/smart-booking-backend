import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { CreateSpecialistDto, PaginationSpecialistResponseDto, SpecialistResponseDto, UpdateSpecialistDto } from './dto';
import { SpecialistsService } from './specialists.service';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('branches/:branchTerm/specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchTerm', description: 'Term to search for the branch. Term can be slug or id.' })
  @ApiResponse({ status: 201, description: 'Specialist created successfully.', type: SpecialistResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not a specialist.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  create(
    @Param('branchTerm') branchTerm: string,
    @Body() createSpecialistDto: CreateSpecialistDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.create(branchTerm, createSpecialistDto, authenticatedUser);
  }

  @Get()
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchTerm', description: 'Term to search for the branch. Term can be slug or id.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of specialists to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of specialists to skip.' })
  @ApiResponse({ status: 200, description: 'Specialists retrieved successfully.', type: PaginationSpecialistResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAll(
    @Param('branchTerm') branchTerm: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.findAll(branchTerm, paginationDto, authenticatedUser);
  }

  @Get(':id')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchTerm', description: 'Term to search for the branch. Term can be slug or id.' })
  @ApiResponse({ status: 200, description: 'Specialist retrieved successfully.', type: SpecialistResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findOne(
    @Param('branchTerm') branchTerm: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.findOneSpecialistResponse(branchTerm, id, authenticatedUser);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchTerm', description: 'Term to search for the branch. Term can be slug or id.' })
  @ApiParam({ name: 'id', description: 'Id of the specialist to update.' })
  @ApiResponse({ status: 200, description: 'Specialist updated successfully.', type: SpecialistResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or specialist not found.' })
  update(
    @Param('branchTerm') branchTerm: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSpecialistDto: UpdateSpecialistDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.update(branchTerm, id, updateSpecialistDto, authenticatedUser);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchTerm', description: 'Term to search for the branch. Term can be slug or id.' })
  @ApiParam({ name: 'id', description: 'Id of the specialist to remove.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or specialist not found.' })
  remove(
    @Param('branchTerm') branchTerm: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.specialistsService.remove(branchTerm, id, authenticatedUser);
  }
}
