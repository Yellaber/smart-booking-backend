import { BookingResponseDto, PaginationBookingResponseDto, ServiceBooking } from 'src/bookings/dto';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';

export class BookingResponse {
  private static getServiceBooking(services: Service[]): ServiceBooking[] {
    return services.map(service => ({
      name: service.name,
      durationMinutes: service.durationMinutes
    }));
  }
    
  static get(booking: Booking): BookingResponseDto {
    const { branch, user, specialist, services, ...restBooking } = booking;
    const { name: branchName } = branch;
    const { fullName: userFullName } = user;
    const { fullName: specialistFullName } = specialist.user;
    const servicesBooking = this.getServiceBooking(services);
    return {
      ...restBooking,
      branch: branchName,
      user: userFullName,
      specialist: specialistFullName,
      services: servicesBooking
    };
  }

  static getPagination(total: number, bookings: Booking[]): PaginationBookingResponseDto {
    const bookingsResponse = bookings.map(booking => this.get(booking));
    return { total, bookings: bookingsResponse };
  }
}