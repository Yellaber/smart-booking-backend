import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { RegisterUserDto, UserResponseDto } from 'src/users/dto';
import { LoginResponseDto, LoginUserDto, RegisterResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService
  ) {}

  async register(companySlug: string, registerUserDto: RegisterUserDto) {
    const company = await this.companiesService.findOne(companySlug);
    const { password, ...restRegisterUserDto } = registerUserDto;
    const user = this.userRepository.create({
      ...restRegisterUserDto,
      password: bcrypt.hashSync(password, 10),
      company
    });
    await this.userRepository.save(user);
    const jwtPayload = { userId: user.id, companyId: company.id };
    return this.getRegisterResponseDto(user, jwtPayload);
  }

  async login(companySlug: string, loginUserDto: LoginUserDto) {
    const company = await this.companiesService.findOne(companySlug);
    const { userName, password } = loginUserDto;
    const user = await this.getUserByUserNameAndCompany(userName, company);

    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    const jwtPayload = { userId: user.id, companyId: company.id };
    return this.getLoginResponseDto(user, jwtPayload);
  }

  async refresh(companySlug: string, user: User) {
    const companyFound = await this.companiesService.findOne(companySlug);
    const { id, company } = user;

    if(company.id !== companyFound.id)
      throw new UnauthorizedException('User unauthorized.');

    const jwtPayload = { userId: id, companyId: companyFound.id };
    return this.getLoginResponseDto(user, jwtPayload);
  }

  private async getUserByUserNameAndCompany(userName: string, company: Company) {
    const user = await this.userRepository.findOne({
      where: { userName: userName.toLowerCase(), company: { id: company.id } }
    });

    if(!user)
      throw new UnauthorizedException('Credentials are not valid (userName)');
    return user;
  }

  private getUserResponseDto(user: User): UserResponseDto {
    const { password, company, ...userResponse }  = user;
    return userResponse;
  }
  
  private getRegisterResponseDto(user: User, jwtPayload: JwtPayload): RegisterResponseDto {
    const userResponse = this.getUserResponseDto(user);
    const token = this.getJwtToken(jwtPayload);
    return { user: userResponse, token };
  }
  
  private getLoginResponseDto(user: User, jwtPayload: JwtPayload): LoginResponseDto {
    const { userName } = user;
    const token = this.getJwtToken(jwtPayload);
    return { userName, token };
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload);
  }
}
