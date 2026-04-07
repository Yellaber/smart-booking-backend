import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserRole } from 'src/common/enums';
import { CreateCompanyDto } from 'src/companies/dto';
import { Company } from 'src/companies/entities/company.entity';
import { Country } from 'src/countries/entities/country.entity';
import { countriesIso3166 } from 'src/countries/interfaces/countries-iso3166.interface';
import { RegisterUserDto } from 'src/users/dto';
import { User } from 'src/users/entities/user.entity';
import { SetupResponse } from './helpers/setup-response.helper';

@Injectable()
export class SetupService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource
  ) {}

  async bootstrap(registerUserDto: RegisterUserDto) {
    const hasCompanies = await this.countCompanies();
    
    if(hasCompanies)
      return SetupResponse.get('Setup has already been completed', false);
    
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
      await manager.insert(Country, countriesIso3166);
      return SetupResponse.get('Setup completed successfully', true);
    });
  }

  private getCreateCompanyDto(): CreateCompanyDto {
    return {
      idNumber: '123456789',
      name: 'Smart Booking',
      webSite: 'www.smartbooking.com'
    }
  }

  private async countCompanies() {
    const count = await this.dataSource.getRepository(Company)
      .createQueryBuilder('company')
      .getCount();
    return count > 0;
  }
}
