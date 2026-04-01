import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AppointmentStatus, UserRole } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { BookingsService } from './bookings.service';
import { BookingResponseDto, CreateBookingDto, PaginationBookingResponseDto } from './dto';
import { ParseBookingStatusPipe } from './pipes/parse-booking-status/parse-booking-status.pipe';

@Controller('branches/:branchId')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('bookings')
  @Auth(UserRole.CUSTOMER, UserRole.SUPER_USER)
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

  @Get('bookings')
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
    return this.bookingsService.findAllByBranch(branchId, paginationDto, authenticatedUser);
  }

  @Get('bookings/status/:status')
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
    return this.bookingsService.findAllByBranch(branchId, paginationDto, authenticatedUser, status);
  }

  @Get('customers/bookings')
  @Auth(UserRole.CUSTOMER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAllByMeCustomer(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByMeCustomer(branchId, paginationDto, authenticatedUser);
  }

  @Get('customers/bookings/:status')
  @Auth(UserRole.CUSTOMER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'status', description: 'Status of the bookings to filter by.', enum: AppointmentStatus })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAllByMeCustomerAndStatus(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('status', ParseBookingStatusPipe) status: AppointmentStatus,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByMeCustomer(branchId, paginationDto, authenticatedUser, status);
  }

  @Get('specialists/bookings')
  @Auth(UserRole.SPECIALIST)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAllByMeSpecialist(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByMeSpecialist(branchId, paginationDto, authenticatedUser);
  }

  @Get('specialists/bookings/status/:status')
  @Auth(UserRole.SPECIALIST)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'status', description: 'Status of the bookings to filter by.', enum: AppointmentStatus })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10, description: 'Number of bookings to return.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0, description: 'Number of bookings to skip.' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.', type: PaginationBookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch not found.' })
  findAllByMeSpecialistAndStatus(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('status', ParseBookingStatusPipe) status: AppointmentStatus,
    @Query() paginationDto: PaginationDto,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.findAllByMeSpecialist(branchId, paginationDto, authenticatedUser, status);
  }

  @Get('specialists/:specialistId/bookings')
  @Auth(UserRole.CUSTOMER, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.SUPER_USER)
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

  @Get('bookings/:bookingId')
  @Auth(UserRole.CUSTOMER, UserRole.SUPER_USER)
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

  @Patch('bookings/:bookingId/cancel')
  @Auth(UserRole.CUSTOMER, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'bookingId', description: 'ID of the booking to cancel (UUID).' })
  @ApiResponse({ status: 200, description: 'Booking canceled successfully.', type: BookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or booking not found.' })
  cancel(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.changeStatus(branchId, bookingId, AppointmentStatus.CANCELED, authenticatedUser);
  }

  @Patch('bookings/:bookingId/complete')
  @Auth(UserRole.CUSTOMER, UserRole.SUPER_USER)
  @ApiParam({ name: 'branchId', description: 'ID of the branch (UUID).' })
  @ApiParam({ name: 'bookingId', description: 'ID of the booking to complete (UUID).' })
  @ApiResponse({ status: 200, description: 'Booking completed successfully.', type: BookingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to access this resource.' })
  @ApiResponse({ status: 404, description: 'Not found. Branch or booking not found.' })
  complete(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.bookingsService.changeStatus(branchId, bookingId, AppointmentStatus.COMPLETED, authenticatedUser);
  }
}
