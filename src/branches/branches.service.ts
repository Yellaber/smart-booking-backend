import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { Company } from 'src/companies/entities/company.entity';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { User } from 'src/users/entities/user.entity';
import { BranchResponseDto, CreateBranchDto, PaginationBranchResponseDto, UpdateBranchDto } from './dto';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchesService {
  private readonly dbException = new DbException('BranchesService');

  constructor(
    private readonly companiesService: CompaniesService,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>
  ) {}

  async create(companySlug: string, createBranchDto: CreateBranchDto, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    this.validatePermission(company, authenticatedUser);

    try {
      const branch = this.branchRepository.create({ ...createBranchDto, company });
      await this.branchRepository.save(branch);
      return this.getBranchResponse(branch);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(companySlug: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    this.validatePermission(company, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ branches, total ] = await this.branchRepository.findAndCount({
      where: { company: { id: company.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return this.getPaginationBranchResponse(total, branches);
  }

  async findOneBranchResponse(companyTerm: string, branchId: string, authenticatedUser: User) {
    const branch = await this.findOne(companyTerm, branchId, authenticatedUser);
    return this.getBranchResponse(branch);
  }

  async update(companySlug: string, branchId: string, updateBranchDto: UpdateBranchDto, authenticatedUser: User) {
    const branchFound = await this.findOne(companySlug, branchId, authenticatedUser);
    const branch = this.branchRepository.merge(branchFound, updateBranchDto);

    try {
      await this.branchRepository.save(branch);
      return this.getBranchResponse(branch);
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
    this.validatePermission(companyFound, authenticatedUser);
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

    this.validatePermission(branch.company, authenticatedUser);
    return branch;
  }

  private validatePermission(company: Company, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SUPER_USER)) return;
  
    const { company: companyUser } = authenticatedUser;
      
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
