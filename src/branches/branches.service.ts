import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { CountriesService } from 'src/countries/countries.service';
import { DbException, Permission } from 'src/common/helpers';
import { User } from 'src/users/entities/user.entity';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { Branch } from './entities/branch.entity';
import { BranchResponse } from './helpers/branch-response.helper';

@Injectable()
export class BranchesService {
  private readonly dbException = new DbException('BranchesService');

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly countriesService: CountriesService,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>
  ) {}

  async create(companySlug: string, createBranchDto: CreateBranchDto, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    Permission.validateInCompany(company, authenticatedUser);
    const country = await this.countriesService.findOneBy(createBranchDto.alpha2CodeCountry);

    try {
      const branch = this.branchRepository.create({ ...createBranchDto, company, country });
      await this.branchRepository.save(branch);
      return BranchResponse.get(branch);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(companySlug: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    Permission.validateInCompany(company, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ branches, total ] = await this.branchRepository.findAndCount({
      where: { company: { id: company.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return BranchResponse.getPagination(total, branches);
  }

  async findOneBranchResponse(companyTerm: string, branchId: string, authenticatedUser: User) {
    const branch = await this.findOne(companyTerm, branchId, authenticatedUser);
    return BranchResponse.get(branch);
  }

  async update(companySlug: string, branchId: string, updateBranchDto: UpdateBranchDto, authenticatedUser: User) {
    const branchFound = await this.findOne(companySlug, branchId, authenticatedUser);
    const branch = this.branchRepository.merge(branchFound, updateBranchDto);

    try {
      await this.branchRepository.save(branch);
      return BranchResponse.get(branch);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(companySlug: string, branchId: string, authenticatedUser: User) {
    const branch = await this.findOne(companySlug, branchId, authenticatedUser);
    branch.isActive = false;
    await this.branchRepository.save(branch);
  }

  async findOne(companySlug: string, branchTerm: string, authenticatedUser: User) {
    const companyFound = await this.companiesService.findOne(companySlug);
    Permission.validateInCompany(companyFound, authenticatedUser);
    const company = { id: companyFound.id };
    const query = isUUID(branchTerm)? { id: branchTerm, company, isActive: true }: { slug: branchTerm.toLowerCase(), company, isActive: true };
    const branch = await this.branchRepository.findOne({ where: query, relations: { company: true } });

    if(!branch)
      throw new NotFoundException(`Branch with '${ branchTerm }' not found`);

    return branch;
  }

  async findOneById(branchId: string, authenticatedUser: User) {
    const query = { id: branchId, isActive: true };
    const branch = await this.branchRepository.findOne({ where: query, relations: { company: true } });

    if(!branch)
      throw new NotFoundException(`Branch with '${ branchId }' not found`);

    Permission.validateInCompany(branch.company, authenticatedUser);
    return branch;
  }
}
