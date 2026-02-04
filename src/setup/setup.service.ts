import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/enums';
import { CreateCompanyDto } from 'src/companies/dto';
import { InitSetupDto, SetupResponseDto, UserSetupDto } from './dto';

@Injectable()
export class SetupService {
  private readonly dbException = new DbException('SetupService');

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async bootstraping(initSetupDto: InitSetupDto) {
    const { company, user } = initSetupDto;
    const { password, roles, ...restUser } = user;
    const hasSuperUser = await this.countSuperUserByCompany(company.idNumber);
    if(!hasSuperUser) {
      const saltRounds = Number(this.configService.get<string>('BCRYPT_SALT')?? 10);
      const passwordBcrypt = await bcrypt.hash(password, saltRounds);
      const companyFound = await this.createCompany(company);
      await this.createUser(companyFound, {
        ...restUser,
        password: passwordBcrypt,
        roles: [ UserRole.SUPER_USER ]
      });
      return this.getSetupResponse('Setup completed successfully', true);
    }
    return this.getSetupResponse('Setup has already been completed', false);
  }

  private async countSuperUserByCompany(idNumberCompany: string) {
    const count =  await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.company', 'company')
      .where('company.idNumber = :idNumberCompany', { idNumberCompany })
      .andWhere(':role = ANY(user.roles)', { role: UserRole.SUPER_USER })
      .getCount();
    return count === 1;
  }

  private async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(company);
      return company;
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private async createUser(company: Company, userSetupDto: UserSetupDto) {
    try {
      const user = this.userRepository.create({
        ...userSetupDto,
        company
      });
      await this.userRepository.save(user);
      return user;
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private getSetupResponse(message: string, success: boolean): SetupResponseDto {
    return { message, success };
  }
}
