import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { CreateServiceDto, PaginationServiceResponseDto, ServiceResponseDto, UpdateServiceDto } from './dto';
import { ServicesService } from './services.service';

@Controller('branches/:branchId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiResponse({ status: 201, description: 'The service has been created successfully.', type: ServiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  create(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() createServiceDto: CreateServiceDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.servicesService.create(branchId, createServiceDto, authenticatedUser);
  }

  @Get()
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of services to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of services to skip.' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully.', type: PaginationServiceResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAll(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.servicesService.findAll(branchId, paginationDto, authenticatedUser);
  }

  @Get(':serviceId')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'serviceId', description: 'ID of the service to retrieve (UUID).' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully.', type: ServiceResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  findOne(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.servicesService.findOneServiceResponse(branchId, serviceId, authenticatedUser);
  }

  @Patch(':serviceId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'serviceId', description: 'ID of the service to update (UUID).' })
  @ApiResponse({ status: 200, description: 'Service updated successfully.', type: ServiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  update(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.servicesService.update(branchId, serviceId, updateServiceDto, authenticatedUser);
  }

  @Patch(':serviceId/status')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'serviceId', description: 'ID of the service to update (UUID).' })
  @ApiResponse({ status: 200, description: 'Status of the service updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  status(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.servicesService.status(branchId, serviceId, authenticatedUser);
  }

  @Delete(':serviceId')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'serviceId', description: 'ID of the service to delete (UUID).' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  remove(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.servicesService.remove(branchId, serviceId, authenticatedUser);
  }
}
