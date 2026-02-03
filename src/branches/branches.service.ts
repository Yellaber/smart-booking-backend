import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CompaniesService } from 'src/companies/companies.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Branch } from './entities/branch.entity';
import { BranchResponseDto, CreateBranchDto, PaginationBranchResponseDto, UpdateBranchDto } from './dto';

@Injectable()
export class BranchesService {
  private readonly dbException = new DbException('BranchesService');

  constructor(
    private readonly companiesService: CompaniesService,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>
  ) {}

  async create(companySlug: string, createBranchDto: CreateBranchDto) {
    const company = await this.companiesService.findOne(companySlug);
    
    try {
      const branch = this.branchRepository.create({
        ...createBranchDto,
        company
      });
      await this.branchRepository.save(branch);
      return this.getBranchResponse(branch);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(companySlug: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const companyFound = await this.companiesService.findOne(companySlug);
    const [ branches, totalPage ] = await this.branchRepository.findAndCount({
      where: { company: { id: companyFound.id } },
      take: limit,
      skip: offset
    });

    return this.getPaginationBranchResponse(totalPage, branches);
  }

  async findOneBranchResponse(companyTerm: string, branchTerm: string) {
    const branch = await this.findOne(companyTerm, branchTerm);
    return this.getBranchResponse(branch);
  }

  async update(companySlug: string, id: string, updateBranchDto: UpdateBranchDto) {
    await this.findOne(companySlug, id);

    const branch = await this.branchRepository.preload({
      id,
      ...updateBranchDto,
    });

    if(!branch)
      throw new NotFoundException(`Branch with id '${ id }' not found`);

    try {
      await this.branchRepository.save(branch);
      return this.getBranchResponse(branch);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private async findOne(companySlug: string, branchTerm: string) {
    const companyFound = await this.companiesService.findOne(companySlug);
    const company = { id: companyFound.id };
    const query = isUUID(branchTerm)? { id: branchTerm, company }: { slug: branchTerm.toLowerCase(), company };
    const branch = await this.branchRepository.findOne({
      where: query,
      relations: { company: true }
    });

    if(!branch)
      throw new NotFoundException(`Branch with '${ branchTerm }' not found`);
    return branch;
  }

  private getBranchResponse(branch: Branch): BranchResponseDto {
    const { company, ...restBranch } = branch;
    return restBranch;
  }

  private getPaginationBranchResponse(totalPage: number, branches: Branch[]): PaginationBranchResponseDto {
    const branchesResponse = branches.map(this.getBranchResponse);
    return { totalPage, branches: branchesResponse };
  }
}
