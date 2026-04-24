import { ForbiddenException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { DbException } from '../common/helpers';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '../companies/entities/company.entity';
import { RegisterUserDto } from '../users/dto';
import { LoginUserDto } from './dto';
import { AuthResponse } from './helpers/auth-response.helper';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';

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
      const token = this.getJwtToken(jwtPayload);
      return AuthResponse.getRegister(user, token);
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
    const token = this.getJwtToken(jwtPayload);
    return AuthResponse.getLogin(user, token);
  }

  async refresh(companySlug: string, authenticatedUser: User) {
    const company = await this.companiesService.findOne(companySlug);
    const { id: userAuthenticatedId, company: companyAuthenticatedUser } = authenticatedUser;

    if(companyAuthenticatedUser.id !== company.id)
      throw new ForbiddenException('User does not have permission to access this resource. User must belong to the same company');

    const jwtPayload = { userId: userAuthenticatedId, companyId: company.id };
    const token = this.getJwtToken(jwtPayload);
    return AuthResponse.getLogin(authenticatedUser, token);
  }

  private async getUserByUserNameAndCompany(company: Company, userName: string) {
    const user = await this.userRepository.findOne({
      where: { userName: userName.toLowerCase(), company: { id: company.id } }
    });

    if(!user)
      throw new UnauthorizedException('Credentials are not valid');

    return user;
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    return this.jwtService.sign(jwtPayload);
  }
}
