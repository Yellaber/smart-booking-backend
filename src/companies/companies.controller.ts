import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.companiesService.findAll(paginationDto);
  }
  
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.companiesService.findOnePlan(term);
  }

  @Get(':companyTerm/branches')
  findAllBranches(@Param('companyTerm') companyTerm: string, @Query() paginationDto: PaginationDto) {
    return this.companiesService.findAllBranches(companyTerm, paginationDto);
  }

  @Get(':companyTerm/branches/:branchTerm')
  findBranch(@Param('companyTerm') companyTerm: string, @Param('branchTerm') branchTerm: string) {
    return this.companiesService.findBranch(companyTerm, branchTerm);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }
}
