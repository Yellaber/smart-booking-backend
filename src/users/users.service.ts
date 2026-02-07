import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Company } from 'src/companies/entities/company.entity';
import { User } from './entities/user.entity';
import { PaginationUserResponseDto, UpdateUserDto, UserResponseDto } from './dto';

@Injectable()
export class UsersService {
  private readonly dbException = new DbException('UsersService');

  constructor(
    private readonly companiesService: CompaniesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(companySlug: string, paginationDto: PaginationDto, user: User) {
    const companyFound = await this.companiesService.findOne(companySlug);
    this.validatePermission(companyFound, user);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ users, total ] = await this.userRepository.findAndCount({
      where: { company: { id: companyFound.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return this.getPaginationUserResponseDto(total, users);
  }

  async findOneUserResponse(companySlug: string, id: string, user: User) {
    const userFound = await this.findOne(companySlug, id, user);
    return this.getUserResponseDto(userFound);
  }

  async update(companySlug: string, id: string, updateUserDto: UpdateUserDto, user: User) {
    const userFound = await this.findOne(companySlug, id, user);
    const userToUpdate = this.userRepository.merge(userFound, updateUserDto);

    try {
      await this.userRepository.save(userToUpdate);
      return this.getUserResponseDto(userToUpdate);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(companySlug: string, id: string, user: User) {
    const userFound = await this.findOne(companySlug, id, user);
    userFound.isActive = false;
    await this.userRepository.save(userFound);
  }

  private async findOne(companySlug: string, id: string, user: User) {
    const companyFound = await this.companiesService.findOne(companySlug);
    this.validatePermission(companyFound, user, id);
    const company = { id: companyFound.id };
    const userFound = await this.userRepository.findOne({ where: { id, company, isActive: true } });
    
    if(!userFound)
      throw new NotFoundException(`User with '${ id }' not found`);

    return userFound;
  }

  private validatePermission(company: Company, user: User, id: string = '') {
    if(user.roles.includes(UserRole.SUPER_USER))
      return;
  
    const { company: companyUser, id: userId } = user;

    if(company.id === companyUser.id && (user.roles.includes(UserRole.ADMIN) || (userId === id)))
      return;

    throw new ForbiddenException('User does not have permission to access this resource');
  }

  private getUserResponseDto(user: User): UserResponseDto {
    const { password, company, isActive, ...userResponse }  = user;
    return userResponse;
  }

  private getPaginationUserResponseDto(total: number, users: User[]): PaginationUserResponseDto {
    const usersResponse = users.map(this.getUserResponseDto);
    return { total, users: usersResponse };
  }
}
