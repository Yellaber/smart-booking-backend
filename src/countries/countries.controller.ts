import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Auth } from '../auth/decorators';
import { UserRole } from '../common/enums';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { CountryResponse } from './helpers';

@Controller('countries')
@Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully.', type: [ CountryResponse ] })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':term')
  @ApiParam({ name: 'term', description: 'Search term (code, ISO code or country name).' })
  @ApiResponse({ status: 200, description: 'Country retrieved successfully.', type: CountryResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Country not found.' })
  findOneBy(@Param('term') term: string) {
    return this.countriesService.findOneBy(term);
  }
}
