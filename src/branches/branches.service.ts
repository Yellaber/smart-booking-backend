import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchesService {
  private readonly dbException = new DbException('BranchesService');

  constructor(
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const { companyId, ...restBranchDto } = createBranchDto;
    const companyFound = await this.companiesService.findOne(companyId);
    
    if(!companyFound)
      throw new NotFoundException(`Company with id '${ companyId }' not found`);
    
    try {
      const branch = this.branchRepository.create({
        ...restBranchDto,
        company: companyFound,
      });
      await this.branchRepository.save(branch);
      return this.planBranch(branch);
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  async findOne(id: string) {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: { company: true }
    });
        
    if(!branch)
      throw new NotFoundException(`Branch with id '${ id }' not found`);
    return branch;
  }

  async findByCompany(companyId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [ branches, total ] = await this.branchRepository.findAndCount({
      where: { company: { id: companyId } },
      take: limit,
      skip: offset
    });

    const branchesPlan = branches.map(({ createdAt, updatedAt, company, ...restBranch }) => restBranch );
    return { total, branches: branchesPlan };
  }

  async findOneBranch(companyId: string, branchTerm: string) {
    const company = { id: companyId };
    const query = isUUID(branchTerm)? { id: branchTerm, company }: { slug: branchTerm.toLowerCase(), company };
    const branch = await this.branchRepository.findOne({
      where: query,
      relations: { company: true }
    });

    if(!branch)
      throw new NotFoundException(`Branch with '${ branchTerm }' not found`);
    return this.planBranch(branch);
  }

  async findOnePlan(id: string) {
    const branch = await this.findOne(id);
    return this.planBranch(branch);
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.preload({
      id,
      ...updateBranchDto,
    });

    if(!branch)
      throw new NotFoundException(`Branch with id '${ id }' not found`);

    try {
      await this.branchRepository.save(branch);
      return this.planBranch(branch);
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  private planBranch(branch: Branch) {
    const { company, createdAt: branchCreatedAt, updatedAt: branchUpdatedAt, ...restBranch } = branch;

    if(!company)
      return restBranch;

    const { branches, createdAt: companyCreatedAt, updatedAt: companyUpdatedAt, ...restCompany } = company;
    return {
      ...restBranch,
      company: restCompany
    };
  }
}
