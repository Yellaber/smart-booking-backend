import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException, Permission } from 'src/common/helpers';
import { User } from 'src/users/entities/user.entity';
import { CompanyResponseDto, CreateCompanyDto, PaginationCompanyResponseDto, UpdateCompanyDto } from './dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  private readonly dbException = new DbException('CompaniesService');

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(company);
      return this.getCompanyResponseDto(company);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [ companies, total ] = await this.companyRepository.findAndCount({
      where: { isActive: true },
      take: limit,
      skip: offset
    });

    return this.getPaginationCompanyResponse(total, companies);
  }

  async findOneCompanyResponse(companyTerm: string, authenticatedUser: User) {
    const company = await this.findOne(companyTerm);
    Permission.validateInCompany(company, authenticatedUser);
    return this.getCompanyResponseDto(company);
  }

  async update(companyId: string, updateCompanyDto: UpdateCompanyDto, authenticatedUser: User) {
    const companyFound = await this.findOne(companyId);
    Permission.validateInCompany(companyFound, authenticatedUser);
    const company = this.companyRepository.merge(companyFound, updateCompanyDto);

    try {
      await this.companyRepository.save(company);
      return this.getCompanyResponseDto(company);
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
    const company = await this.companyRepository.findOne({ where: query });
    
    if(!company)
      throw new NotFoundException(`Company with '${ companyTerm }' not found`);

    return company;
  }

  private getCompanyResponseDto(company: Company): CompanyResponseDto {
    const { branches, users, isActive, ...restCompany } = company;
    return restCompany;
  }

  private getPaginationCompanyResponse(total: number, companies: Company[]): PaginationCompanyResponseDto {
    const companiesResponse = companies.map(this.getCompanyResponseDto);
    return { total, companies: companiesResponse };
  }
}
