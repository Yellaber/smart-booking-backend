import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { UserRole } from '../common/enums';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';

@Controller('categories')
@Auth(UserRole.ADMIN, UserRole.SUPER_USER)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully.', type: [ CategoryResponseDto ] })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId')
  @ApiParam({ name: 'categoryId', description: 'Category ID.' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully.', type: CategoryResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Category not found.' })
  findOne(@Param('categoryId') categoryId: string) {
    return this.categoriesService.findOne(categoryId);
  }
}
