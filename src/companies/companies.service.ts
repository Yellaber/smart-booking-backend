import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Company } from './entities/company.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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
    const [ companies, totalPages ] = await this.companyRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: { branches: true }
    });

    return this.getPaginationCompanyResponse(totalPages, companies);
  }

  async findOne(term: string) {
    const query = isUUID(term)? { id: term }: { slug: term.toLowerCase() };    
    const company = await this.companyRepository.findOne({
      where: query,
      relations: { branches: true }
    });
    
    if(!company)
      throw new NotFoundException(`Company with '${ term }' not found`);
    return company;
  }

  async findOneCompanyResponse(term: string) {
    const company = await this.findOne(term);
    return this.getCompanyResponseDto(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.preload({
      id,
      ...updateCompanyDto,
    });

    if(!company)
      throw new NotFoundException(`Company with id '${ id }' not found`);

    try {
      await this.companyRepository.save(company);
      return this.getCompanyResponseDto(company);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private getCompanyResponseDto(company: Company): CompanyResponseDto {
    const { branches, users, ...restCompany } = company;
    return restCompany;
  }

  private getPaginationCompanyResponse(totalPages: number, companies: Company[]): PaginationCompanyResponseDto {
    const companiesResponse = companies.map(this.getCompanyResponseDto);
    return { totalPages, companies: companiesResponse };
  }
}
