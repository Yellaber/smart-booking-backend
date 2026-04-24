import { CompanyResponseDto, PaginationCompanyResponseDto } from '../dto';
import { Company } from '../entities/company.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';

export class CompanyResponse {
    private static getSubCategoriesNames(subCategories: SubCategory[]) {
        return subCategories.map(subCategory => subCategory.name);
    }

    static get(company: Company): CompanyResponseDto {
        const { branches, users, isActive, subCategories, ...restCompany } = company;
        const subCategoriesNames = this.getSubCategoriesNames(subCategories);
        return { ...restCompany, subCategories: subCategoriesNames };
    }

    static getPagination(total: number, companies: Company[]): PaginationCompanyResponseDto {
        const companiesResponse = companies.map(company => this.get(company));
        return { total, companies: companiesResponse };
    }
}