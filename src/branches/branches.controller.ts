import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { BranchesService } from './branches.service';
import { CreateBranchDto, BranchResponseDto, PaginationBranchResponseDto, UpdateBranchDto } from './dto';

@Controller('companies/:companySlug/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to create the branch for.' })
  @ApiResponse({ status: 201, description: 'The branch has been created successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  create(
    @Param('companySlug') companySlug: string,
    @Body() createBranchDto: CreateBranchDto,
    @GetUser() user: User) {
    return this.branchesService.create(companySlug, createBranchDto, user);
  }

  @Get()
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to search for the branches.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of branches to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of branches to skip.' })
  @ApiResponse({ status: 200, description: 'Branches retrieved successfully.', type: PaginationBranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findAll(
    @Param('companySlug') companySlug: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User) {
    return this.branchesService.findAll(companySlug, paginationDto, user);
  }

  @Get(':branchSlug')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to retrieve the branch from.' })
  @ApiParam({ name: 'branchSlug', description: 'Slug of the branch to retrieve.' })
  @ApiResponse({ status: 200, description: 'Branch retrieved successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  findOne(
    @Param('companySlug') companySlug: string,
    @Param('branchSlug') branchSlug: string,
    @GetUser() user: User) {
    return this.branchesService.findOneBranchResponse(companySlug, branchSlug, user);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to update the branch for.' })
  @ApiParam({ name: 'id', description: 'Id of the branch to update.' })
  @ApiResponse({ status: 200, description: 'Branch updated successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  update(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @GetUser() user: User) {
    return this.branchesService.update(companySlug, id, updateBranchDto, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to remove the branch for.' })
  @ApiParam({ name: 'id', description: 'Id of the branch to remove.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  remove(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User) {
    return this.branchesService.remove(companySlug, id, user);
  }
}
