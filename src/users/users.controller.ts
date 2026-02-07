import { Controller, Get, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PaginationUserResponseDto, UpdateUserDto, UserResponseDto } from './dto';

@Controller('companies/:companySlug/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to search for the users.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of users to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of users to skip.' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.', type: PaginationUserResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findAll(
    @Param('companySlug') companySlug: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.usersService.findAll(companySlug, paginationDto, user);
  }

  @Get(':id')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to search the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to search.' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. User or company not found.' })
  findOne(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.usersService.findOneUserResponse(companySlug, id, user);
  }

  @Patch(':id')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to update the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to update.' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. User or company not found.' })
  update(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User
  ) {
    return this.usersService.update(companySlug, id, updateUserDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to remove the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to update.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. User or company not found.' })
  remove(
    @Param('companySlug') companySlug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.usersService.remove(companySlug, id, user);
  }
}
