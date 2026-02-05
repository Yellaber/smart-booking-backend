import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/enums';
import { RegisterUserDto } from 'src/users/dto';
import { CreateCompanyDto } from 'src/companies/dto';
import { SetupResponseDto } from './dto/setup-response.dto';

@Injectable()
export class SetupService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async bootstraping(registerUserDto: RegisterUserDto) {
    const hasCompanies = await this.countCompanies();
    
    if(!hasCompanies) {
      const { password, ...restUser } = registerUserDto;
      const company = this.getCreateCompanyDto();
      const saltRounds = Number(this.configService.get<string>('BCRYPT_SALT')?? 10);
      const passwordBcrypt = await bcrypt.hash(password, saltRounds);
      
      return this.dataSource.transaction(async manager => {
        const companyRepository = manager.getRepository(Company);
        const userRepository = manager.getRepository(User);
        const companySetup = companyRepository.create(company);
        await companyRepository.save(companySetup);
        const userSetup = userRepository.create({
          ...restUser,
          password: passwordBcrypt,
          roles: [ UserRole.SUPER_USER ],
          company: companySetup
        });
        await userRepository.save(userSetup);
        return this.getSetupResponse('Setup completed successfully', true);
      });
    }
    return this.getSetupResponse('Setup has already been completed', false);
  }

  private getCreateCompanyDto(): CreateCompanyDto {
    return {
      idNumber: '11111111111',
      name: 'System',
      webSite: 'www.mywebsite.com'
    }
  }

  private async countCompanies() {
    const count = await this.dataSource.getRepository(Company)
      .createQueryBuilder('company')
      .getCount();
    return count > 0;
  }

  private getSetupResponse(message: string, success: boolean): SetupResponseDto {
    return { message, success };
  }
}
