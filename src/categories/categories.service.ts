import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryResponse } from './helpers/category-response.helper';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories.map(category => CategoryResponse.get(category));
  }

  async findOne(categoryId: string) {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });

    if(!category)
      throw new NotFoundException(`Category with ${ categoryId } not found`);

    return CategoryResponse.get(category);
  }
}
