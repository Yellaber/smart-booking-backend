import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CompaniesService } from 'src/companies/companies.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
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

  async create(companySlug: string, createBranchDto: CreateBranchDto, user: User) {
    const company = await this.companiesService.findOne(companySlug);
    this.validatePermission(company, user);
    
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

  async findAll(companySlug: string, paginationDto: PaginationDto, user: User) {
    const company = await this.companiesService.findOne(companySlug);
    this.validatePermission(company, user);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ branches, total ] = await this.branchRepository.findAndCount({
      where: { company: { id: company.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return this.getPaginationBranchResponse(total, branches);
  }

  async findOneBranchResponse(companyTerm: string, branchTerm: string, user: User) {
    const branch = await this.findOne(companyTerm, branchTerm, user);
    return this.getBranchResponse(branch);
  }

  async update(companySlug: string, id: string, updateBranchDto: UpdateBranchDto, user: User) {
    const branchFound = await this.findOne(companySlug, id, user);
    const branch = this.branchRepository.merge(branchFound, updateBranchDto);

    try {
      await this.branchRepository.save(branch);
      return this.getBranchResponse(branch);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(companySlug: string, id: string, user: User) {
    const branch = await this.findOne(companySlug, id, user);
    branch.isActive = false;
    await this.branchRepository.save(branch);
  }

  private async findOne(companySlug: string, branchTerm: string, user: User) {
    const companyFound = await this.companiesService.findOne(companySlug);
    this.validatePermission(companyFound, user);
    const company = { id: companyFound.id };
    const query = isUUID(branchTerm)? { id: branchTerm, company, isActive: true }: { slug: branchTerm.toLowerCase(), company, isActive: true };
    const branch = await this.branchRepository.findOne({
      where: query,
      relations: { company: true }
    });

    if(!branch)
      throw new NotFoundException(`Branch with '${ branchTerm }' not found`);
    return branch;
  }

  private validatePermission(company: Company, user: User) {
    if(user.roles.includes(UserRole.SUPER_USER)) return;
  
    const { company: companyUser } = user;
      
    if(company.id !== companyUser.id)
      throw new ForbiddenException('User does not have permission to access this resource');
  }

  private getBranchResponse(branch: Branch): BranchResponseDto {
    const { company, isActive, ...restBranch } = branch;
    return restBranch;
  }

  private getPaginationBranchResponse(total: number, branches: Branch[]): PaginationBranchResponseDto {
    const branchesResponse = branches.map(this.getBranchResponse);
    return { total, branches: branchesResponse };
  }
}
