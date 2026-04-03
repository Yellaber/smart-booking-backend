import { Controller, Get, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { PaginationUserResponseDto, UpdateUserDto, UserResponseDto } from './dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('companies/:companySlug/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of users to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of users to skip.' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.', type: PaginationUserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  findAll(
    @Param('companySlug') companySlug: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.usersService.findAll(companySlug, paginationDto, authenticatedUser);
  }

  @Get(':userId')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiParam({ name: 'userId', description: 'ID of the user to retrieve (UUID).' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or user not found.' })
  findOne(
    @Param('companySlug') companySlug: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.usersService.findOneUserResponse(companySlug, userId, authenticatedUser);
  }

  @Patch(':userId')
  @Auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiParam({ name: 'userId', description: 'ID of the user to update (UUID).' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or user not found.' })
  update(
    @Param('companySlug') companySlug: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.usersService.update(companySlug, userId, updateUserDto, authenticatedUser);
  }

  @Delete(':userId')
  @Auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiParam({ name: 'userId', description: 'ID of the user to remove (UUID).' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Company or user not found.' })
  remove(
    @Param('companySlug') companySlug: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.usersService.remove(companySlug, userId, authenticatedUser);
  }
}
