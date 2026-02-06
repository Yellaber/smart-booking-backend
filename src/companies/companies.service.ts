import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { User } from 'src/users/entities/user.entity';
import { Company } from './entities/company.entity';
import { CompanyResponseDto, CreateCompanyDto, PaginationCompanyResponseDto, UpdateCompanyDto } from './dto';

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

  async findOneCompanyResponse(term: string, user: User) {
    const company = await this.findOne(term);
    this.validatePermission(company, user);
    return this.getCompanyResponseDto(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: User) {
    const companyFound = await this.findOne(id);
    this.validatePermission(companyFound, user);
    const company = this.companyRepository.merge(companyFound, updateCompanyDto);

    try {
      await this.companyRepository.save(company);
      return this.getCompanyResponseDto(company);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    company.isActive = false;
    await this.companyRepository.save(company);
  }

  async findOne(term: string) {
    const query = isUUID(term)? { id: term, isActive: true }: { slug: term.toLowerCase(), isActive: true };
    const company = await this.companyRepository.findOne({
      where: query,
      relations: { branches: true }
    });
    
    if(!company)
      throw new NotFoundException(`Company with '${ term }' not found`);
    return company;
  }

  private validatePermission(company: Company, user: User) {
    if(user.roles.includes(UserRole.SUPER_USER)) return;
    
    const { company: companyUser } = user;
    
    if(company.id !== companyUser.id)
      throw new ForbiddenException('User does not have permission to access this resource');
  }

  private getCompanyResponseDto(company: Company): CompanyResponseDto {
    const { branches, users, specialties, isActive, ...restCompany } = company;
    return restCompany;
  }

  private getPaginationCompanyResponse(total: number, companies: Company[]): PaginationCompanyResponseDto {
    const companiesResponse = companies.map(this.getCompanyResponseDto);
    return { total, companies: companiesResponse };
  }
}
