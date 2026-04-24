import { SubCategory } from '../entities/subcategory.entity';

export class SubCategoryResponse {
    static get(subCategory: SubCategory) {
        const { id, name } = subCategory;
        return { id, name };
    }
}