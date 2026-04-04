import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AppointmentStatus, UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { BookingsService } from './bookings.service';
import { BookingResponseDto, CreateBookingDto, PaginationBookingResponseDto } from './dto';
import { ParseBookingStatusPipe } from './pipes/parse-booking-status/parse-booking-status.pipe';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('branches/:branchId/bookings')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST , UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiResponse({ status: 201, description: 'The booking has been created successfully.', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch, User, Specialist or Services not found.' })
  create(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() createBookingDto: CreateBookingDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.create(branchId, createBookingDto, authenticatedUser);
  }

  @Get('branches/:branchId/bookings')
  @Auth(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAllByBranch(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByBranchId(branchId, paginationDto, authenticatedUser);
  }

  @Get('branches/:branchId/bookings/status/:status')
  @Auth(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'status', description: 'Status of the bookings to filter by.', enum: AppointmentStatus })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAllByBranchAndStatus(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('status', ParseBookingStatusPipe) status: AppointmentStatus,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByBranchId(branchId, paginationDto, authenticatedUser, status);
  }

  @Get('branches/:branchId/specialists/:specialistId/bookings')
  @Auth(UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'specialistId', description: 'ID of the specialist (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or specialist not found.' })
  findAllBySpecialist(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('specialistId', ParseUUIDPipe) specialistId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllBySpecialistId(branchId, specialistId, paginationDto, authenticatedUser);
  }

  @Get('branches/:branchId/bookings/:bookingId')
  @Auth(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'bookingId', description: 'ID of the booking to retrieve (UUID).' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully.', type: BookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or booking not found.' })
  findOneById(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findOneBookingResponseById(branchId, bookingId, authenticatedUser);
  }

  @Patch('branches/:branchId/bookings/:bookingId/status/:status')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'bookingId', description: 'ID of the booking to update (UUID).' })
  @ApiParam({ name: 'status', description: 'New status for the booking.', enum: AppointmentStatus })
  @ApiResponse({ status: 200, description: 'Booking updated successfully.', type: BookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or booking not found.' })
  changeStatus(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('status', ParseBookingStatusPipe) status: AppointmentStatus,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.changeStatus(branchId, bookingId, status, authenticatedUser);
  }

  @Get('users/:userId/bookings')
  @Auth(UserRole.CUSTOMER, UserRole.SPECIALIST, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiParam({ name: 'userId', description: 'ID of the user (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. User not found.' })
  findAllByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByUserId(userId, paginationDto, authenticatedUser);
  }
}
