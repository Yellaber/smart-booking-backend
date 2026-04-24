import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { UserRole } from '../common/enums';
import { SubCategoryResponseDto } from './dto/subcategory-response.dto';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
@Auth(UserRole.ADMIN, UserRole.SUPER_USER)
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Subcategories retrieved successfully.', type: [ SubCategoryResponseDto ] })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':subCategoryId')
  @ApiParam({ name: 'subCategoryId', description: 'Subcategory ID.' })
  @ApiResponse({ status: 200, description: 'Subcategory retrieved successfully.', type: SubCategoryResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Subcategory not found.' })
  findOneById(@Param('subCategoryId', ParseUUIDPipe) subCategoryId: string) {
    return this.subcategoriesService.findOneById(subCategoryId);
  }
}
