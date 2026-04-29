import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserRole } from '../common/enums';
import { DbException, Permission } from '../common/helpers';
import { CompaniesService } from '../companies/companies.service';
import { UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserResponse } from './helpers/user-response.helper';

@Injectable()
export class UsersService {
  private readonly dbException = new DbException('UsersService');

  constructor(
    private readonly configService: ConfigService,
    private readonly companiesService: CompaniesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(companySlug: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    Permission.validate(company, authenticatedUser, '', [ UserRole.ADMIN ]);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ users, total ] = await this.userRepository.findAndCount({
      where: { company: { id: company.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return UserResponse.getPagination(total, users);
  }

  async findOneUserResponse(companySlug: string, userId: string, authenticatedUser: User) {
    const user = await this.findOne(companySlug, userId, authenticatedUser);
    return UserResponse.get(user);
  }

  async update(companySlug: string, userId: string, updateUserDto: UpdateUserDto, authenticatedUser: User) {
    const user = await this.findOne(companySlug, userId, authenticatedUser);

    if(updateUserDto.password) {
      const saltRounds = Number(this.configService.get<string>('BCRYPT_SALT')?? 10);
      const passwordBcrypt = await bcrypt.hash(updateUserDto.password, saltRounds);
      updateUserDto.password = passwordBcrypt;
    }

    const userToUpdate = this.userRepository.merge(user, updateUserDto);

    try {
      await this.userRepository.save(userToUpdate);
      return UserResponse.get(userToUpdate);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(companySlug: string, userId: string, authenticatedUser: User) {
    const user = await this.findOne(companySlug, userId, authenticatedUser);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async findOne(companyId: string, userId: string, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companyId);
    const user = await this.userRepository.findOne({ where: { id: userId, company: { id: companyId }, isActive: true } });
    
    if(!user)
      throw new NotFoundException(`User with '${ userId }' not found`);

    Permission.validate(company, authenticatedUser, userId, [ UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN ]);
    return user;
  }
}
