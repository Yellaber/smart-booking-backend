import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto, PaginationSpecialtyResponseDto, SpecialtyResponseDto, UpdateSpecialtyDto } from './dto';

@Controller('companies/:companySlug/specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to create the specialty.' })
  @ApiResponse({ status: 201, description: 'The specialty has been created successfully.', type: SpecialtyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  create(
    @Param('companySlug') companySlug: string,
    @Body() createSpecialtyDto: CreateSpecialtyDto,
    @GetUser() user: User
  ) {
    return this.specialtiesService.create(companySlug, createSpecialtyDto, user);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to search for the specialties.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of specialties to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of specialties to skip.' })
  @ApiResponse({ status: 200, description: 'Specialties retrieved successfully.', type: PaginationSpecialtyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findAll(
    @Param('companySlug') companySlug: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.specialtiesService.findAll(companySlug, paginationDto, user);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to retrieve the specialty.' })
  @ApiParam({ name: 'id', description: 'Id of the specialty to retrieve.' })
  @ApiResponse({ status: 200, description: 'Specialty retrieved successfully.', type: SpecialtyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or specialty not found.' })
  findOne(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.specialtiesService.findOneSpecialtyResponse(companySlug, id, user);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to update the specialty.' })
  @ApiParam({ name: 'id', description: 'Id of the specialty to update.' })
  @ApiResponse({ status: 200, description: 'Specialty updated successfully.', type: SpecialtyResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or specialty not found.' })
  update(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
    @GetUser() user: User
  ) {
    return this.specialtiesService.update(companySlug, id, updateSpecialtyDto, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to remove the specialty.' })
  @ApiParam({ name: 'id', description: 'Id of the specialty to remove.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or specialty not found.' })
  remove(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.specialtiesService.remove(companySlug, id, user);
  }
}
