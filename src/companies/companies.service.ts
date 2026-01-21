import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { BranchesService } from '../branches/branches.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  private readonly dbException = new DbException('CompaniesService');

  constructor(
    @Inject(forwardRef(() => BranchesService))
    private readonly branchesService: BranchesService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(company);
      return this.planCompany(company);
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [ companies, total ] = await this.companyRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: { branches: true }
    });

    const companiesPlan = companies.map(this.planCompany);
    return { total, companies: companiesPlan };
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

  async findOnePlan(term: string) {
    const company = await this.findOne(term);
    return this.planCompany(company);
  }

  async findAllBranches(companyTerm: string, paginationDto: PaginationDto) {
    const { id } = await this.findOne(companyTerm);
    return this.branchesService.findByCompany(id, paginationDto);
  }

  async findBranch(companyTerm: string, branchTerm: string) {
    const { id: companyId } = await this.findOne(companyTerm);
    return this.branchesService.findOneBranch(companyId, branchTerm);
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
      return this.planCompany(company);
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  private planCompany(company: Company) {
    const { branches, createdAt: companyCreatedAt, updatedAt: companyUpdatedAt, ...restCompany } = company;

    if(!branches) {
      return { 
        ...restCompany,
        branches: []
      };
    }

    return {
      ...restCompany,
      branches: branches.map(branch => {
        const { company, createdAt: branchCreatedAt, updatedAt: branchUpdatedAt, ...restBranch } = branch;
        return restBranch;
      })
    };
  }
}
