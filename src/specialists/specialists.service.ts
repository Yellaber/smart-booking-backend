import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateSpecialistDto, DataUserResponseDto, PaginationSpecialistResponseDto, SpecialistResponseDto, UpdateSpecialistDto } from './dto';
import { Specialist } from './entities/specialist.entity';
import { SpecialistQuery } from './interfaces/specialist-query.interface';

@Injectable()
export class SpecialistsService {
  private readonly dbException = new DbException('SpecialistsService');

  constructor(
    private readonly branchesService: BranchesService,
    private readonly usersService: UsersService,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>
  ) {}

  async create(branchTerm: string, createSpecialistDto: CreateSpecialistDto, authenticatedUser: User) {
    const { slug: companySlug } = authenticatedUser.company;
    const { userId } = createSpecialistDto;
    const branch = await this.branchesService.findOne(companySlug, branchTerm, authenticatedUser);
    const userFound = await this.usersService.findOne(companySlug, userId, authenticatedUser);

    if(!userFound.roles.includes(UserRole.SPECIALIST))
      throw new BadRequestException('User is not a specialist');

    try {
      const specialist = this.specialistRepository.create({
        branch,
        user: userFound
      });
      await this.specialistRepository.save(specialist);
      return this.getSpecialistResponse(specialist);
    } catch(error) {
     return this.dbException.handle(error);
    }
  }

  async findAll(branchTerm: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const { slug: companySlug } = authenticatedUser.company;
    const branch = await this.branchesService.findOne(companySlug, branchTerm, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const specialistQuery = this.getSpecialistQuery(branch, authenticatedUser);
    const [ specialists, total ] = await this.specialistRepository.findAndCount({
      where: specialistQuery,
      take: limit,
      skip: offset,
      relations: { user: true }
    });

    return this.getPaginationSpecialistResponse(total, specialists);
  }

  async findOneById(specialistId: string) {
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId, isActive: true },
      relations: { branch: true }
    });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ specialistId }' not found`);

    return specialist;
  }

  async findOneByUserId(authenticatedUser: User) {
    const specialist = await this.specialistRepository.findOne({
      where: { user: { id: authenticatedUser.id }, isActive: true },
      relations: { branch: true }
    });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ authenticatedUser.id }' not found`);

    return specialist;
  }

  async findOneSpecialistResponse(branchTerm: string, specialistId: string, authenticatedUser: User) {
    const specialist = await this.findOne(branchTerm, specialistId, authenticatedUser);
    return this.getSpecialistResponse(specialist);
  }

  async update(branchTerm: string, specialistId: string, updateSpecialistDto: UpdateSpecialistDto, authenticatedUser: User) {
    const specialistFound = await this.findOne(branchTerm, specialistId, authenticatedUser);
    const specialist = this.specialistRepository.merge(specialistFound, updateSpecialistDto);

    try {
      await this.specialistRepository.save(specialist);
      return this.getSpecialistResponse(specialist);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private async findOne(branchTerm: string, specialistId: string, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SPECIALIST) && authenticatedUser.id !== specialistId)
      throw new ForbiddenException('User does not have permission to access this resource');

    const { slug: companySlug } = authenticatedUser.company;
    const branch = await this.branchesService.findOne(companySlug, branchTerm, authenticatedUser);
    const specialistQuery = this.getSpecialistQuery(branch, authenticatedUser, specialistId);
    const specialist = await this.specialistRepository.findOne({
      where: specialistQuery,
      relations: { user: true }
    });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ specialistId }' not found in branch '${ branchTerm }'`);

    return specialist;
  }

  private getSpecialistQuery(branch: Branch, authenticatedUser: User, specialistId?: string) {
    const { id } = branch;
    let query: SpecialistQuery = { branch: { id } };
    
    if(specialistId)
      query = { id: specialistId, ...query };

    return (authenticatedUser.roles.includes(UserRole.ADMIN) || authenticatedUser.roles.includes(UserRole.SUPER_USER))? 
      query: { ...query, isActive: true };
  }

  private getDataUserResponse(authenticatedUser: User): DataUserResponseDto {
    const { id, fullName, image } = authenticatedUser;
    return { id, fullName, image };
  }

  private getSpecialistResponse(specialist: Specialist): SpecialistResponseDto {
    const { id, user } = specialist;
    const dataUser = this.getDataUserResponse(user);
    return {
      id,
      user: dataUser
    };
  }

  private getPaginationSpecialistResponse(total: number, specialists: Specialist[]): PaginationSpecialistResponseDto {
    const specialistsResponse = specialists.map(specialist => this.getSpecialistResponse(specialist));
    return { total, specialists: specialistsResponse };
  }
}
