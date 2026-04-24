import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { In, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { DbException, Permission } from '../common/helpers';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { User } from '../users/entities/user.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { Company } from './entities/company.entity';
import { CompanyResponse } from './helpers/company-response.helper';

@Injectable()
export class CompaniesService {
  private readonly dbException = new DbException('CompaniesService');

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { subCategoriesIds, ...restCreateCompanyDto } = createCompanyDto;
    const subCategories = await this.getSubCategories(subCategoriesIds);

    try {
      const company = this.companyRepository.create({ ...restCreateCompanyDto, subCategories });
      await this.companyRepository.save(company);
      return CompanyResponse.get(company);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [ companies, total ] = await this.companyRepository.findAndCount({
      where: { isActive: true },
      take: limit,
      skip: offset,
      relations: { subCategories: true }
    });

    return CompanyResponse.getPagination(total, companies);
  }

  async findOneCompanyResponse(companyTerm: string, authenticatedUser: User) {
    const company = await this.findOne(companyTerm);
    Permission.validateInCompany(company, authenticatedUser);
    return CompanyResponse.get(company);
  }

  async update(companyId: string, updateCompanyDto: UpdateCompanyDto, authenticatedUser: User) {
    const companyFound = await this.findOne(companyId);
    Permission.validateInCompany(companyFound, authenticatedUser);
    const company = this.companyRepository.merge(companyFound, updateCompanyDto);

    try {
      await this.companyRepository.save(company);
      return CompanyResponse.get(company);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(companyId: string) {
    const company = await this.findOne(companyId);
    company.isActive = false;
    await this.companyRepository.save(company);
  }

  async findOne(companyTerm: string) {
    const query = isUUID(companyTerm)? { id: companyTerm, isActive: true }: { slug: companyTerm.toLowerCase(), isActive: true };
    const company = await this.companyRepository.findOne({ where: query, relations: { subCategories: true } });
    
    if(!company)
      throw new NotFoundException(`Company with '${ companyTerm }' not found`);

    return company;
  }

  private async getSubCategories(subCategoriesIds: string[]) {
    const uniqueSubCategoriesIds = [ ...new Set(subCategoriesIds) ];
    const subCategories = await this.subCategoryRepository.findBy({ id: In(uniqueSubCategoriesIds) });
    
    if(subCategories.length !== uniqueSubCategoriesIds.length)
      throw new NotFoundException('One or more subcategories not found');
    
    return subCategories;
  }
}
