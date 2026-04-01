import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers';
import { User } from 'src/users/entities/user.entity';
import { CreateServiceDto, PaginationServiceResponseDto, ServiceResponseDto, UpdateServiceDto } from './dto';
import { Service } from './entities/service.entity';
import { ServiceQuery } from './interfaces/service-query.interface';

@Injectable()
export class ServicesService {
  private readonly dbException = new DbException('ServicesService');
  
  constructor(
    private readonly branchesService: BranchesService,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  async create(branchId: string, createServiceDto: CreateServiceDto, authenticatedUser: User) {
    const { company } = authenticatedUser;
    const branch = await this.branchesService.findOne(company.id, branchId, authenticatedUser);
    
    try {
      const service = this.serviceRepository.create({ ...createServiceDto, branch });
      await this.serviceRepository.save(service);
      return this.getServiceResponse(service);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(branchId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const { company } = authenticatedUser;
    const branch = await this.branchesService.findOne(company.id, branchId, authenticatedUser);
    const serviceQuery = this.getServiceQuery(branch, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ services, total ] = await this.serviceRepository.findAndCount({ where: serviceQuery, take: limit, skip: offset });
    return this.getPaginationServiceResponse(total, services);
  }

  async findOneServiceResponse(branchId: string, serviceId: string, authenticatedUser: User) {
    const service = await this.findOne(branchId, serviceId, authenticatedUser);
    return this.getServiceResponse(service);
  }

  async update(branchId: string, serviceId: string, updateServiceDto: UpdateServiceDto, authenticatedUser: User) {
    const serviceFound = await this.findOne(branchId, serviceId, authenticatedUser);
    const service = this.serviceRepository.merge(serviceFound, updateServiceDto);

    try {
      await this.serviceRepository.save(service);
      return this.getServiceResponse(service);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async status(branchId: string, serviceId: string, authenticatedUser: User) {
    const serviceFound = await this.findOne(branchId, serviceId, authenticatedUser);
    serviceFound.isActive = !serviceFound.isActive;
    await this.serviceRepository.save(serviceFound);
  }

  async remove(branchId: string, serviceId: string, authenticatedUser: User) {
    const serviceFound = await this.findOne(branchId, serviceId, authenticatedUser);
    serviceFound.isActive = false;
    await this.serviceRepository.save(serviceFound);
  }

  async findOne(branchId: string, serviceId: string, authenticatedUser: User) {
    const { company } = authenticatedUser;
    const branch = await this.branchesService.findOne(company.id, branchId, authenticatedUser);
    const serviceQuery = this.getServiceQuery(branch, authenticatedUser, serviceId);
    const service = await this.serviceRepository.findOne({ where: serviceQuery, relations: { branch: true } });

    if(!service)
      throw new NotFoundException(`Service with '${ serviceId }' not found`);

    return service;
  }

  private getServiceQuery(branch: Branch, authenticatedUser: User, serviceId?: string) {
    const { id } = branch;
    let query: ServiceQuery = { branch: { id } };
      
    if(serviceId)
      query = { id: serviceId, ...query };
  
    return (authenticatedUser.roles.includes(UserRole.ADMIN) || authenticatedUser.roles.includes(UserRole.SUPER_USER))? 
      query: { ...query, isActive: true };
  }

  private getServiceResponse(service: Service): ServiceResponseDto {
    const { isActive, branch, ...restService } = service;
    return restService;
  }

  private getPaginationServiceResponse(total: number, services: Service[]): PaginationServiceResponseDto {
    const servicesResponse = services.map(this.getServiceResponse);
    return { total, services: servicesResponse };
  }
}
