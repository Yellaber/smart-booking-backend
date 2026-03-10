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
  @ApiParam({ name: 'branchId', description: 'ID of the branch to create the service.' })
  @ApiResponse({ status: 201, description: 'The service has been created successfully.', type: ServiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  create(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() createServiceDto: CreateServiceDto,
    @GetUser() user: User
  ) {
    return this.servicesService.create(branchId, createServiceDto, user);
  }

  @Get()
  @Auth()
  @ApiParam({ name: 'branchId', description: 'ID of the branch to search for services.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of services to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of services to skip.' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully.', type: PaginationServiceResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAll(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.servicesService.findAll(branchId, paginationDto, user);
  }

  @Get(':id')
  @Auth()
  @ApiParam({ name: 'branchId', description: 'ID of the branch to retrieve the service from.' })
  @ApiParam({ name: 'id', description: 'ID of the service to retrieve.' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully.', type: ServiceResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  findOne(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.servicesService.findOneServiceResponse(branchId, id, user);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch to update the service.' })
  @ApiParam({ name: 'id', description: 'Id of the service to update.' })
  @ApiResponse({ status: 200, description: 'Service updated successfully.', type: ServiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  update(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @GetUser() user: User
  ) {
    return this.servicesService.update(branchId, id, updateServiceDto, user);
  }

  @Patch(':id/status')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch to update the status of the service.' })
  @ApiParam({ name: 'id', description: 'Id of the service to update.' })
  @ApiResponse({ status: 200, description: 'Status of the service updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  status(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.servicesService.status(branchId, id, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch to delete the service.' })
  @ApiParam({ name: 'id', description: 'Id of the service to delete.' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or service not found.' })
  remove(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.servicesService.remove(branchId, id, user);
  }
}
