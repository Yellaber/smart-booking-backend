import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { CompaniesService } from 'src/companies/companies.service';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationUserResponseDto, UpdateUserDto, UserResponseDto } from './dto';

@Injectable()
export class UsersService {
  private readonly dbException = new DbException('UsersService');

  constructor(
    private readonly companiesService: CompaniesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(companySlug: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const companyFound = await this.companiesService.findOne(companySlug);
    const [ users, totalPage ] = await this.userRepository.findAndCount({
      where: { company: { id: companyFound.id } },
      take: limit,
      skip: offset
    });

    return this.getPaginationUserResponseDto(totalPage, users);
  }

  async findOneUserResponse(companySlug: string, term: string) {
    const user = await this.findOne(companySlug, term);
    return this.getUserResponseDto(user);
  }

  async update(companySlug: string, id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(companySlug, id);

    if(updateUserDto.password)
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if(!user)
      throw new NotFoundException(`User with id '${ id }' not found`);

    try {
      await this.userRepository.save(user);
      return this.getUserResponseDto(user);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  me(companySlug: string, user: User) {
    const { id } = user;
    return this.findOneUserResponse(companySlug, id);
  }

  private async findOne(companySlug: string, term: string) {
    const companyFound = await this.companiesService.findOne(companySlug);
    const company = { id: companyFound.id };
    const query = isUUID(term)? { id: term, company }: { userName: term.toLowerCase(), company };
    const user = await this.userRepository.findOne({ 
      where: query,
      relations: { company: true }
    });
      
    if(!user)
      throw new NotFoundException(`User with '${ term }' not found`);
    return user;
  }

  private getUserResponseDto(user: User): UserResponseDto {
    const { password, company, ...userResponse }  = user;
    return userResponse;
  }

  private getPaginationUserResponseDto(totalPages: number, users: User[]): PaginationUserResponseDto {
    const usersResponse = users.map(this.getUserResponseDto);
    return { totalPages, users: usersResponse };
  }
}
