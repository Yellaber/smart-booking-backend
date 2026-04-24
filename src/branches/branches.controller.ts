import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserRole } from '../common/enums';
import { User } from '../users/entities/user.entity';
import { BranchesService } from './branches.service';
import { CreateBranchDto, BranchResponseDto, PaginationBranchResponseDto, UpdateBranchDto } from './dto';

@Controller('companies/:companySlug/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiResponse({ status: 201, description: 'The branch has been created successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  create(
    @Param('companySlug') companySlug: string,
    @Body() createBranchDto: CreateBranchDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.branchesService.create(companySlug, createBranchDto, authenticatedUser);
  }

  @Get()
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of branches to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of branches to skip.' })
  @ApiResponse({ status: 200, description: 'Branches retrieved successfully.', type: PaginationBranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findAll(
    @Param('companySlug') companySlug: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.branchesService.findAll(companySlug, paginationDto, authenticatedUser);
  }

  @Get(':branchId')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiParam({ name: 'branchId', description: 'ID of the branch to retrieve (UUID).' })
  @ApiResponse({ status: 200, description: 'Branch retrieved successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  findOne(
    @Param('companySlug') companySlug: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.branchesService.findOneBranchResponse(companySlug, branchId, authenticatedUser);
  }

  @Patch(':branchId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiParam({ name: 'branchId', description: 'ID of the branch to update (UUID).' })
  @ApiResponse({ status: 200, description: 'Branch updated successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  update(
    @Param('companySlug') companySlug: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.branchesService.update(companySlug, branchId, updateBranchDto, authenticatedUser);
  }

  @Delete(':branchId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiParam({ name: 'branchId', description: 'ID of the branch to remove (UUID).' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  remove(
    @Param('companySlug') companySlug: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.branchesService.remove(companySlug, branchId, authenticatedUser);
  }
}
