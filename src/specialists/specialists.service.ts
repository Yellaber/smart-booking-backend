import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BranchesService } from '../branches/branches.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserRole } from '../common/enums';
import { DbException, Permission } from '../common/helpers';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateSpecialistDto } from './dto';
import { Specialist } from './entities/specialist.entity';
import { FormatSpecialistQuery, SpecialistResponse } from './helpers';

@Injectable()
export class SpecialistsService {
  private readonly dbException = new DbException('SpecialistsService');

  constructor(
    private readonly branchesService: BranchesService,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly usersService: UsersService
  ) {}

  async create(branchId: string, createSpecialistDto: CreateSpecialistDto, authenticatedUser: User) {
    const { slug: companySlug } = authenticatedUser.company;
    const { userId, servicesIds } = createSpecialistDto;
    const branch = await this.branchesService.findOne(companySlug, branchId, authenticatedUser);
    const user = await this.usersService.findOne(companySlug, userId, authenticatedUser);
    const services = await this.findServicesInBranch(servicesIds, branch.id);

    if(!user.roles.includes(UserRole.SPECIALIST))
      throw new BadRequestException('User is not a specialist');

    try {
      const specialist = this.specialistRepository.create({ branch, user, services });
      await this.specialistRepository.save(specialist);
      return SpecialistResponse.get(specialist);
    } catch(error) {
     return this.dbException.handle(error);
    }
  }

  async findAll(branchId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SPECIALIST))
      throw new ForbiddenException('User does not have permission to access this resource. Only allowed for customer, receptionist, admin and super-user.');

    const { slug: companySlug } = authenticatedUser.company;
    const branch = await this.branchesService.findOne(companySlug, branchId, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const specialistQuery = FormatSpecialistQuery.get(branch, authenticatedUser);
    const [ specialists, total ] = await this.specialistRepository.findAndCount({
      where: specialistQuery,
      take: limit,
      skip: offset,
      relations: { user: true }
    });

    return SpecialistResponse.getPagination(total, specialists);
  }

  async findOneById(specialistId: string) {
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId, isActive: true },
      relations: { branch: { company: true }, user: true }
    });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ specialistId }' not found`);

    return specialist;
  }

  async findOneByUserId(authenticatedUser: User) {
    const specialist = await this.specialistRepository.findOne({
      where: { user: { id: authenticatedUser.id }, isActive: true },
      relations: { branch: { company: true } }
    });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ authenticatedUser.id }' not found`);

    return specialist;
  }

  async findOneSpecialistResponse(branchId: string, specialistId: string, authenticatedUser: User) {
    const specialist = await this.findOne(branchId, specialistId, authenticatedUser);
    const { company } = specialist.branch;
    Permission.validateSpecialist(company, authenticatedUser, specialist);
    return SpecialistResponse.get(specialist);
  }

  async status(branchId: string, specialistId: string, authenticatedUser: User) {
    const specialist = await this.findOne(branchId, specialistId, authenticatedUser);
    specialist.isActive = !specialist.isActive;
    await this.specialistRepository.save(specialist);
    return SpecialistResponse.get(specialist);
  }

  private async findOne(branchId: string, specialistId: string, authenticatedUser: User) {
    const { slug: companySlug } = authenticatedUser.company;
    const branch = await this.branchesService.findOne(companySlug, branchId, authenticatedUser);
    const specialistQuery = FormatSpecialistQuery.get(branch, authenticatedUser, specialistId);
    const specialist = await this.specialistRepository.findOne({ where: specialistQuery, relations: { user: true, branch: { company: true } } });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ specialistId }' not found in branch '${ branchId }'`);

    return specialist;
  }

  private async findServicesInBranch(servicesIds: string[], branchId: string) {
    const uniqueServiceIds = [ ...new Set(servicesIds) ];
    const services = await this.serviceRepository.findBy({ id: In(uniqueServiceIds), branch: { id: branchId }, isActive: true });
  
    if(services.length !== uniqueServiceIds.length)
      throw new NotFoundException(`One or more services not found in branch '${ branchId }'`);
  
    return services;
  }
}
