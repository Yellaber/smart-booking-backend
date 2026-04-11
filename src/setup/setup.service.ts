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
import { Category } from 'src/categories/entities/category.entity';
import { categoriesNames } from 'src/categories/interfaces/category.interface';
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
      const countryRepository = manager.getRepository(Country);
      const categoryRepository = manager.getRepository(Category);
      const companySetup = companyRepository.create(company);
      await companyRepository.insert(companySetup);
      const userSetup = userRepository.create({
        ...restUser,
        password: passwordBcrypt,
        roles: [ UserRole.SUPER_USER ],
        company: companySetup
      });
      await userRepository.insert(userSetup);
      const countriesSetup = countryRepository.create(countriesIso3166);
      await countryRepository.insert(countriesSetup);
      const categoriesSetup = categoryRepository.create(categoriesNames);
      await categoryRepository.insert(categoriesSetup);
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
    const count = await this.dataSource.getRepository(Company).createQueryBuilder('company').getCount();
    return count > 0;
  }
}
