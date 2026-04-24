import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';
import { SubCategoryResponse } from './helpers/subcategory-response.helper';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>
  ) {}

  async findAll() {
    const subCategories = await this.subCategoryRepository.find();
    return subCategories.map(subCategory => SubCategoryResponse.get(subCategory));
  }

  async findOneById(subCategoryId: string) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id: subCategoryId });

    if(!subCategory)
      throw new NotFoundException(`Subcategory with ${ subCategoryId } not found`);

    return SubCategoryResponse.get(subCategory);
  }
}
