import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':term')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  findOneBy(@Param('term') term: string) {
    return this.countriesService.findOneBy(term);
  }
}
