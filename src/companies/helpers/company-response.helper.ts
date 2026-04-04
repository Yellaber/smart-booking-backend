import { CompanyResponseDto, PaginationCompanyResponseDto } from '../dto';
import { Company } from '../entities/company.entity';

export class CompanyResponse {
    static get(company: Company): CompanyResponseDto {
        const { branches, users, isActive, ...restCompany } = company;
        return restCompany;
    }

    static getPagination(total: number, companies: Company[]): PaginationCompanyResponseDto {
        const companiesResponse = companies.map(company => this.get(company));
        return { total, companies: companiesResponse };
    }
}