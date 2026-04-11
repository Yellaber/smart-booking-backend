import { Category } from '../entities/category.entity';

export class CategoryResponse {
    static get(category: Category): CategoryResponse {
        const { id, name } = category;
        return { id, name };
    }
}