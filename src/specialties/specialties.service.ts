import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { CompaniesService } from 'src/companies/companies.service';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Specialty } from './entities/specialty.entity';
import { CreateSpecialtyDto, PaginationSpecialtyResponseDto, SpecialtyResponseDto, UpdateSpecialtyDto } from './dto';

@Injectable()
export class SpecialtiesService {
  private readonly dbException = new DbException('SpecialtiesService');

  constructor(
    private readonly companiesService: CompaniesService,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>
  ) {}

  async create(companySlug: string, createSpecialtyDto: CreateSpecialtyDto, user: User) {
    const company = await this.companiesService.findOne(companySlug);
    this.validatePermission(companySlug, company, user);

    try {
      const specialty = this.specialtyRepository.create({
        ...createSpecialtyDto,
        company
      });
      await this.specialtyRepository.save(specialty);
      return this.getSpecialtyResponse(specialty);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(companySlug: string, paginationDto: PaginationDto, user: User) {
    const company = await this.companiesService.findOne(companySlug);
    this.validatePermission(companySlug, company, user);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ specialties, totalPage ] = await this.specialtyRepository.findAndCount({
      where: { company: { id: company.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return this.getPaginationSpecialtyResponse(totalPage, specialties);
  }

  async findOneSpecialtyResponse(companySlug: string, term: string, user: User) {
    const specialty = await this.findOne(companySlug, term, user);
    return this.getSpecialtyResponse(specialty);
  }

  async update(companySlug: string, id: string, updateSpecialtyDto: UpdateSpecialtyDto, user: User) {
    await this.findOne(companySlug, id, user);
    
    const specialty = await this.specialtyRepository.preload({
      id,
      ...updateSpecialtyDto,
    });
    
    if(!specialty)
      throw new NotFoundException(`Specialty with id '${ id }' not found`);
    
    try {
      await this.specialtyRepository.save(specialty);
      return this.getSpecialtyResponse(specialty);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(companySlug: string, id: string, user: User) {
    await this.findOne(companySlug, id, user);
    const updateSpecialtyDto = { isActive: false };
    await this.update(companySlug, id, updateSpecialtyDto, user);
  }

  private async findOne(companySlug: string, specialtyId: string, user: User) {
    const companyFound = await this.companiesService.findOne(companySlug);
    this.validatePermission(companySlug, companyFound, user);
    const company = { id: companyFound.id };
    const query = { id: specialtyId, company, isActive: true };
    const specialty = await this.specialtyRepository.findOne({ 
      where: query,
      relations: { company: true }
    });

    if(!specialty)
      throw new NotFoundException(`Specialty with '${ specialtyId }' not found`);
    return specialty;
  }

  private validatePermission(companySlug: string, company: Company, user: User) {
    const { company: companyUser } = user;
    
    if(companySlug === 'system' && user.roles.includes(UserRole.ADMIN) || company.id !== companyUser.id)
      throw new ForbiddenException('User does not have permission to access this resource');
  }

  private getSpecialtyResponse(specialty: Specialty): SpecialtyResponseDto {
    const { company, isActive, ...userSpecialty }  = specialty;
    return userSpecialty;
  }

  private getPaginationSpecialtyResponse(totalPages: number, specialties: Specialty[]): PaginationSpecialtyResponseDto {
    const specialtiesResponse = specialties.map(this.getSpecialtyResponse);
    return { totalPages, specialties: specialtiesResponse };
  }
}
