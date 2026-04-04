import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AppointmentStatus, UserRole } from 'src/common/enums';
import { DbException, Permission } from 'src/common/helpers';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { DayOfWeek } from 'src/schedules/interfaces/day-of-week.enum';
import { ScheduleException } from 'src/schedule-exceptions/entities/schedule-exception.entity';
import { TypeScheduleException } from 'src/schedule-exceptions/interfaces/type-schedule-exception.enum';
import { Service } from 'src/services/entities/service.entity';
import { Specialist } from 'src/specialists/entities/specialist.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBookingDto } from './dto';
import { Booking } from './entities/booking.entity';
import { BookingResponse } from './helpers/booking-response.helper';
import { BookingQuery } from './interface/booking-query.interface';

@Injectable()
export class BookingsService {
  private readonly dbException = new DbException('BookingsService');
  
  constructor(
    private readonly branchesService: BranchesService,
    private readonly dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(branchId: string, createBookingDto: CreateBookingDto, authenticatedUser: User) {
    const { userId, specialistId, servicesIds, ...restBooking } = createBookingDto;
    const branch = await this.branchesService.findOneById(branchId, authenticatedUser);
    const { company } = branch;
    Permission.validate(company, authenticatedUser, userId, [ UserRole.RECEPTIONIST, UserRole.ADMIN ]);
    const user = await this.findUserInCompany(userId, company.id);
    const specialist = await this.findSpecialistInBranch(specialistId, branchId);
    const services = await this.findServicesInBranch(servicesIds, branchId);
    await this.validateSpecialistServices(specialistId, servicesIds);
    const endTime = this.calculateEndTime(restBooking.startTime, services);
    await this.validateSpecialistSchedule(specialistId, restBooking.date, restBooking.startTime, endTime);
    await this.validateSpecialistScheduleExceptionsBlock(specialistId, restBooking.date, restBooking.startTime, endTime);
    await this.validateBookingTimeSlot(specialistId, restBooking.date, restBooking.startTime, endTime);

    try {
      const booking = this.bookingRepository.create({ ...restBooking, endTime, branch, user, specialist, services });
      await this.bookingRepository.save(booking);
      return BookingResponse.get(booking);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAllByBranchId(branchId: string, paginationDto: PaginationDto, authenticatedUser: User, status?: AppointmentStatus) {
    await this.branchesService.findOneById(branchId, authenticatedUser);
    let query: BookingQuery = { branch: { id: branchId } };

    if(status)
      query = { ...query, status };

    return this.getPaginationBooking(query, paginationDto);
  }

  async findAllBySpecialistId(branchId: string, specialistId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    await this.branchesService.findOneById(branchId, authenticatedUser);
    const { company } = authenticatedUser;
    const specialist = await this.findSpecialistInBranch(specialistId, branchId);
    const { user } = specialist;
    Permission.validate(company, authenticatedUser, user.id, [ UserRole.RECEPTIONIST, UserRole.ADMIN ]);
    const query: BookingQuery = { branch: { id: branchId }, specialist: { id: specialistId } };
    return this.getPaginationBooking(query, paginationDto);
  }

  async findAllByUserId(userId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const { company } = authenticatedUser;
    await this.findUserInCompany(userId, company.id);
    Permission.validate(company, authenticatedUser, userId, []);
    const query: BookingQuery = { user: { id: userId } };
    return this.getPaginationBooking(query, paginationDto);
  }


  async findOneBookingResponseById(branchId: string, bookingId: string, authenticatedUser: User) {
    const booking = await this.findOneById(branchId, bookingId, authenticatedUser);
    return BookingResponse.get(booking);
  }

  async changeStatus(branchId: string, bookingId: string, status: AppointmentStatus, authenticatedUser: User) {
    const booking = await this.findOneById(branchId, bookingId, authenticatedUser);
    const { user, branch } = booking;
    Permission.validate(branch.company, authenticatedUser, user.id, [ UserRole.RECEPTIONIST, UserRole.ADMIN ]);
    booking.status = status;
    await this.bookingRepository.save(booking);
    return BookingResponse.get(booking);
  }
  
  async findOneById(branchId: string, bookingId: string, authenticatedUser: User) {
    await this.branchesService.findOneById(branchId, authenticatedUser);
    const booking = await this.bookingRepository.findOne({ 
      where: { id: bookingId, branch: { id: branchId } },
      relations: { 
        branch: { company: true },
        user: true,
        specialist: { user: true },
        services: true
      }
    });

    if(!booking)
      throw new NotFoundException(`Booking with '${ bookingId }' not found in branch '${ branchId }'`);

    return booking;
  }

  private async getPaginationBooking(query: BookingQuery, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [ bookings, total ] = await this.bookingRepository.findAndCount({ 
      where: query, 
      take: limit, 
      skip: offset,
      relations: { branch: true, user: true, specialist: { user: true }, services: true }
    });

    return BookingResponse.getPagination(total, bookings);
  }

  private async findServicesInBranch(servicesIds: string[], branchId: string) {
    const uniqueServiceIds = [ ...new Set(servicesIds) ];
    const services = await this.serviceRepository.findBy({ id: In(uniqueServiceIds), branch: { id: branchId }, isActive: true });

    if(services.length !== uniqueServiceIds.length)
      throw new NotFoundException(`One or more services not found in branch '${ branchId }'`);

    return services;
  }

  private async findUserInCompany(userId: string, companyId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId, company: { id: companyId } } });

    if(!user)
      throw new NotFoundException(`User with '${ userId }' not found in company '${ companyId }'`);

    return user;
  }

  private async findSpecialistInBranch(specialistId: string, branchId: string) {
    const specialist = await this.specialistRepository.findOne({ 
      where: { id: specialistId, branch: { id: branchId }, isActive: true },
      relations: { user: true }
    });

    if(!specialist)
      throw new NotFoundException(`Specialist with '${ specialistId }' not found in branch '${ branchId }'`);

    return specialist;
  }

  private async validateSpecialistServices(specialistId: string, servicesIds: string[]) {
    const uniqueServiceIds = [ ...new Set(servicesIds) ];
    const countSpecialistServices = await this.dataSource
      .createQueryBuilder()
      .select('ss.servicesId', 'servicesId')
      .from('specialist_services', 'ss')
      .where('ss.specialistsId = :specialistId', { specialistId })
      .andWhere('ss.servicesId IN (:...servicesIds)', { uniqueServiceIds })
      .getCount();
    
    if(countSpecialistServices !== uniqueServiceIds.length)
      throw new BadRequestException(`One or more services are not assigned to the specialist with '${ specialistId }'`);
  }

  private async validateSpecialistSchedule(specialistId: string, date: string, startTime: string, endTime: string) {
    const dayOfWeek = this.getDayOfWeek(date);
    const schedule = await this.dataSource.createQueryBuilder()
      .select('schedule')
      .from(Schedule, 'schedule')
      .where('schedule.specialistId = :specialistId', { specialistId })
      .andWhere('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('(schedule.startTime <= :startTime AND schedule.endTime >= :endTime)', { startTime, endTime })
      .andWhere('schedule.isActive = true')
      .getOne();

    const hasScheduleExceptionsExtra = await this.hasSpecialistScheduleExceptions(specialistId, date, startTime, endTime, TypeScheduleException.EXTRA);

    if(!schedule && !hasScheduleExceptionsExtra)
      throw new BadRequestException(`The specialist with '${ specialistId }' is not available in the selected date and time`);
  }

  private async validateSpecialistScheduleExceptionsBlock(specialistId: string, date: string, startTime: string, endTime: string) {
    const hasScheduleExceptionsBlock = await this.hasSpecialistScheduleExceptions(specialistId, date, startTime, endTime, TypeScheduleException.BLOCK);

    if(hasScheduleExceptionsBlock)
      throw new BadRequestException(`The specialist with '${ specialistId }' is not available in the selected date and time`);
  }

  private async validateBookingTimeSlot(specialistId: string, date: string, startTime: string, endTime: string) {
    const booking = await this.dataSource.createQueryBuilder()
      .select('booking')
      .from(Booking, 'booking')
      .where('booking.specialistId = :specialistId', { specialistId })
      .andWhere('booking.date = :date', { date })
      .andWhere('(booking.startTime < :endTime AND booking.endTime > :startTime)', { endTime, startTime })
      .andWhere('booking.status = :status', { status: AppointmentStatus.CONFIRMED })
      .getOne();

    if(booking)
      throw new BadRequestException(`The specialist with '${ specialistId }' is not available in the selected date and time`);
  }

  private async hasSpecialistScheduleExceptions(specialistId: string, date: string, startTime: string, endTime: string, type: TypeScheduleException) {
    const scheduleExceptions = await this.dataSource.createQueryBuilder()
      .select('schedule_exceptions')
      .from(ScheduleException, 'schedule_exceptions')
      .where('schedule_exceptions.specialistId = :specialistId', { specialistId })
      .andWhere('(schedule_exceptions.date = :date AND schedule_exceptions.type = :type)', { date, type })
      .andWhere('(schedule_exceptions.startTime < :endTime AND schedule_exceptions.endTime > :startTime)', { endTime, startTime })
      .andWhere('schedule_exceptions.isActive = true')
      .getOne();

    return !!scheduleExceptions;
  }

  private calculateEndTime(startTime: string, services: Service[]) {
    const totalDuration = services.reduce((total, service) => total + service.durationMinutes, 0);
    const [ hours, minutes ] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + totalDuration;
    const endTimeHours = Math.floor(totalMinutes / 60);
    const endTimeMinutes = totalMinutes % 60;
    return `${ String(endTimeHours).padStart(2, '0') }:${ String(endTimeMinutes).padStart(2, '0') }`;
  }

  private getDayOfWeek(date: string) {
    const daysOfWeek = Object.values(DayOfWeek);
    const [ year, month, day ] = date.split('-').map(Number);
    const numberDayOfWeek = new Date(year, month - 1, day).getDay();
    return daysOfWeek[ numberDayOfWeek ];
  }
}
