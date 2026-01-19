import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { DbException } from 'src/common/helpers/db-exception.helper';
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
      return company;
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.companyRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let company: Company | null;
    
    if(isUUID(term))
      company = await this.companyRepository.findOneBy({ id: term });
    else {
      const queryBuilder = this.companyRepository.createQueryBuilder();
      company = await queryBuilder
        .where('name =:name or slug =:slug', 
          {
            name: term.toLowerCase(),
            slug: term.toLowerCase(),
          }
        ).getOne();
    }
    
    if(!company)
      throw new NotFoundException(`Company with '${ term }' not found`);

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);
    const updatedCompany = Object.assign(company, updateCompanyDto);

    try {
      await this.companyRepository.save(updatedCompany);
      return updatedCompany;
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    this.companyRepository.remove(company);
    return {
      message: `Company with id '${ id }' was deleted successfully`
    };
  }
}
