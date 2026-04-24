import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { categoriesNames } from '../categories/interfaces/category.interface';
import { UserRole } from '../common/enums';
import { Company } from '../companies/entities/company.entity';
import { Country } from '../countries/entities/country.entity';
import { countriesIso3166 } from '../countries/interfaces/countries-iso3166.interface';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { subCategoriesNames } from '../subcategories/interfaces/subcategory-interface';
import { RegisterUserDto } from '../users/dto';
import { User } from '../users/entities/user.entity';
import { SetupResponse } from './helpers/setup-response.helper';

@Injectable()
export class SetupService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource
  ) {}

  async bootstrap(registerUserDto: RegisterUserDto) {
    const isCompleted = await this.isDoneBootstrap();
    
    if(isCompleted)
      return SetupResponse.get('Setup has already been completed', false);

    const userWithEncriptedPassword = await this.getUserWithEncriptedPassword(registerUserDto);
    return this.getSetupStatus(userWithEncriptedPassword);
  }

  private async getSetupStatus(userWithEncriptedPassword: RegisterUserDto) {
    return this.dataSource.transaction(async manager => {
      const countryRepository = manager.getRepository(Country);
      const categoryRepository = manager.getRepository(Category);
      const subCategoryRepository = manager.getRepository(SubCategory);
      const companyRepository = manager.getRepository(Company);
      const userRepository = manager.getRepository(User);
      const countriesSetup = countryRepository.create(countriesIso3166);
      await countryRepository.save(countriesSetup);
      const categoriesSetup = categoryRepository.create(categoriesNames);
      await categoryRepository.save(categoriesSetup);
      const subCategories = subCategoriesNames.map(subCategory => {
        const category = categoriesSetup.find(categorySetup => categorySetup.name === subCategory.category);
        return subCategoryRepository.create({ ...subCategory, category });
      });
      await subCategoryRepository.save(subCategories);
      const companySetup = companyRepository.create({
        idNumber: '123456789',
        name: 'Smart Booking',
        webSite: 'www.smartbooking.com',
      });
      await companyRepository.save(companySetup);
      const userSetup = userRepository.create({
        ...userWithEncriptedPassword,
        roles: [ UserRole.SUPER_USER ],
        company: companySetup
      });
      await userRepository.save(userSetup);
      return SetupResponse.get('Setup completed successfully', true);
    });
  }

  private async getUserWithEncriptedPassword(registerUserDto: RegisterUserDto) {
    const saltRounds = Number(this.configService.get<string>('BCRYPT_SALT')?? 10);
    registerUserDto.password = await bcrypt.hash(registerUserDto.password, saltRounds);
    return registerUserDto;
  }

  private async isDoneBootstrap() {
    const countCompanies = await this.dataSource
      .getRepository(Company)
      .createQueryBuilder('company')
      .getCount();
    const countUsers = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.roles @> :role', { role: [ UserRole.SUPER_USER ] })
      .getCount();
    const countCountries = await this.dataSource
      .getRepository(Country)
      .createQueryBuilder('country')
      .getCount();
    const countCategories = await this.dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .getCount();
    const countSubCategories = await this.dataSource
      .getRepository(SubCategory)
      .createQueryBuilder('subcategory')
      .getCount();
    return countCompanies > 0 && countUsers > 0 && countCountries > 0 && countCategories > 0 && countSubCategories > 0;
  }
}
