import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { CompaniesService } from './companies.service';
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
  
  @Get(':companyTerm')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companyTerm', description: 'Slug or ID of the company to retrieve.' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully.', type: CompanyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findOne(
    @Param('companyTerm') companyTerm: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.companiesService.findOneCompanyResponse(companyTerm, authenticatedUser);
  }
  
  @Patch(':companyId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companyId', description: 'ID of the company to update (UUID).' })
  @ApiResponse({ status: 200, description: 'Company updated successfully.', type: CompanyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  update(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.companiesService.update(companyId, updateCompanyDto, authenticatedUser);
  }

  @Delete(':companyId')
  @Auth(UserRole.SUPER_USER)
  @ApiParam({ name: 'companyId', description: 'ID of the company to remove (UUID).' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  delete(@Param('companyId', ParseUUIDPipe) companyId: string) {
    return this.companiesService.remove(companyId);
  }
}
