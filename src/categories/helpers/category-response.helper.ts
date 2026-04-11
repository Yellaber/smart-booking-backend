import { CategoryResponseDto } from '../dto/category-response.dto';
import { Category } from '../entities/category.entity';

export class CategoryResponse {
    static get(category: Category): CategoryResponseDto {
        const { id, name } = category;
        return { id, name };
    }
}