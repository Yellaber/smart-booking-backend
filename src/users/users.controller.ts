import { Controller, Get, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from 'src/common/enums';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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
  findAll(@Param('companySlug') companySlug: string, @Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(companySlug, paginationDto);
  }

  @Get('search/:term')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to search for the user.' })
  @ApiParam({ name: 'term', description: 'Term to search for the user (UUID or userName).' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 404, description: 'Not found. User or company not found.' })
  findOne(@Param('companySlug') companySlug: string, @Param('term') term: string) {
    return this.usersService.findOneUserResponse(companySlug, term);
  }

  @Patch(':id')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to update for the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user to update.' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 404, description: 'Not found. User or company not found.' })
  update(@Param('companySlug') companySlug: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(companySlug, id, updateUserDto);
  }

  @Get('me')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Slug of the company to get the current user.' })
  @ApiResponse({ status: 200, description: 'Current user retrieved successfully.', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  me(@Param('companySlug') companySlug: string, @GetUser() user: User) {
    return this.usersService.me(companySlug, user);
  }
}
