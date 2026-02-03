import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CompanyResponseDto, CreateCompanyDto, PaginationCompanyResponseDto, UpdateCompanyDto } from './dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Auth(UserRole.SUPER_USER)
  @ApiResponse({ status: 201, description: 'Company created successfully.', type: CompanyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Auth(UserRole.SUPER_USER)
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of companies to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of companies to skip.' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully.', type: PaginationCompanyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.companiesService.findAll(paginationDto);
  }
  
  @Get(':term')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'term', description: 'Slug or id of the company to retrieve.' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully.', type: CompanyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findOne(@Param('term') term: string) {
    return this.companiesService.findOneCompanyResponse(term);
  }
  
  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'id', description: 'Id of the company to update.' })
  @ApiResponse({ status: 200, description: 'Company updated successfully.', type: CompanyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }
}
