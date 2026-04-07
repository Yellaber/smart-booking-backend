import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CountryResponse, QueryCountry } from './helpers';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>
  ) {}

  async findAll() {
    const countries = await this.countryRepository.find();
    return countries.map(country => CountryResponse.get(country));
  }

  async findOneBy(term: string) {
    let query = QueryCountry.get(term);
    const country = await this.countryRepository.findOneBy(query);

    if(!country)
      throw new NotFoundException(`Country with ${ term } not found`);

    return CountryResponse.get(country);
  }
}
