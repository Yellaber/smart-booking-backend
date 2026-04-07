import { Country } from '../entities/country.entity';

export class CountryResponse {
    static get(country: Country): CountryResponse {
        const { code, name, alpha3Code, alpha2Code } = country;
        return { code, name, alpha3Code, alpha2Code };
    }
}