import { ForbiddenException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { DbException } from 'src/common/helpers';
import { CompaniesService } from 'src/companies/companies.service';
import { Company } from 'src/companies/entities/company.entity';
import { RegisterUserDto, UserResponseDto } from 'src/users/dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponseDto, LoginUserDto, RegisterResponseDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly dbException = new DbException('AuthService');

  constructor(
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async register(companySlug: string, registerUserDto: RegisterUserDto) {
    const company = await this.companiesService.findOne(companySlug);
    const { password: passwordRegisterUser, ...restRegisterUserDto } = registerUserDto;
    const saltRounds = Number(this.configService.get<string>('BCRYPT_SALT')?? 10);
    const password = await bcrypt.hash(passwordRegisterUser, saltRounds);

    try {
      const user = this.userRepository.create({ ...restRegisterUserDto, password, company });
      await this.userRepository.save(user);
      const jwtPayload = { userId: user.id, companyId: company.id };
      return this.getRegisterResponseDto(user, jwtPayload);
    } catch(error) {
      throw this.dbException.handle(error);
    }
  }

  async login(companySlug: string, loginUserDto: LoginUserDto) {
    const company = await this.companiesService.findOne(companySlug);
    const { userName, password } = loginUserDto;
    const user = await this.getUserByUserNameAndCompany(company, userName);

    if(!await bcrypt.compare(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    const jwtPayload = { userId: user.id, companyId: company.id };
    return this.getLoginResponseDto(user, jwtPayload);
  }

  async refresh(companySlug: string, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    const { id: userAuthenticatedId, company: companyAuthenticatedUser } = authenticatedUser;

    if(companyAuthenticatedUser.id !== company.id)
      throw new ForbiddenException('User does not have permission to access this resource. User must belong to the same company');

    const jwtPayload = { userId: userAuthenticatedId, companyId: company.id };
    return this.getLoginResponseDto(authenticatedUser, jwtPayload);
  }

  private async getUserByUserNameAndCompany(company: Company, userName: string) {
    const user = await this.userRepository.findOne({
      where: { userName: userName.toLowerCase(), company: { id: company.id } }
    });

    if(!user)
      throw new UnauthorizedException('Credentials are not valid');

    return user;
  }

  private getUserResponseDto(authenticatedUser: User): UserResponseDto {
    const { password, company, bookings, ...userResponse } = authenticatedUser;
    return userResponse;
  }
  
  private getRegisterResponseDto(authenticatedUser: User, jwtPayload: JwtPayload): RegisterResponseDto {
    const userResponse = this.getUserResponseDto(authenticatedUser);
    const token = this.getJwtToken(jwtPayload);
    return { user: userResponse, token };
  }
  
  private getLoginResponseDto(authenticatedUser: User, jwtPayload: JwtPayload): LoginResponseDto {
    const { userName } = authenticatedUser;
    const token = this.getJwtToken(jwtPayload);
    return { userName, token };
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload);
  }
}
