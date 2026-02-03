import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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
  create(@Param('companySlug') companySlug: string, @Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(companySlug, createBranchDto);
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
  findAll(@Param('companySlug') companySlug: string, @Query() paginationDto: PaginationDto) {
    return this.branchesService.findAll(companySlug, paginationDto);
  }

  @Get('search/:branchSlug')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to retrieve the branch from.' })
  @ApiParam({ name: 'branchSlug', description: 'Slug of the branch to retrieve.' })
  @ApiResponse({ status: 200, description: 'Branch retrieved successfully.', type: BranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or branch not found.' })
  findOne(@Param('companySlug') companySlug: string, @Param('branchSlug') branchSlug: string) {
    return this.branchesService.findOneBranchResponse(companySlug, branchSlug);
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
  update(@Param('companySlug') companySlug: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(companySlug, id, updateBranchDto);
  }
}
