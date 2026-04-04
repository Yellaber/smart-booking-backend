import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AppointmentStatus } from 'src/common/enums';
import { DbException, FormatScheduleQuery, Permission } from 'src/common/helpers';
import { Specialist } from 'src/specialists/entities/specialist.entity';
import { SpecialistsService } from 'src/specialists/specialists.service';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleExceptionDto } from './dto';
import { ScheduleException } from './entities/schedule-exception.entity';
import { ScheduleExceptionResponse } from './helpers/schedule-exception-response.helper';

@Injectable()
export class ScheduleExceptionsService {
  private readonly dbException = new DbException('ScheduleExceptionsService');

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly dataSource: DataSource,
    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>,
    private readonly specialistsService: SpecialistsService
  ) {}

  async create(specialistId: string, createScheduleExceptionDto: CreateScheduleExceptionDto, authenticatedUser: User) {
    this.validateDateAndTimes(createScheduleExceptionDto);
    await this.validateBookingExistence(specialistId, createScheduleExceptionDto);
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { branch } = specialist;
    const branchFound = await this.findBranchById(branch.id);
    Permission.validateInSchedules(branchFound.company, authenticatedUser, specialist);
    const scheduleException = await this.saveScheduleException(specialist, createScheduleExceptionDto);
    return scheduleException;
  }
  
  async findAll(specialistId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { branch } = specialist;
    const branchFound = await this.findBranchById(branch.id);
    Permission.validateInSchedules(branchFound.company, authenticatedUser, specialist);
    const where = FormatScheduleQuery.get(specialistId);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ scheduleExceptions, total ] = await this.scheduleExceptionRepository.findAndCount({ where, take: limit, skip: offset });
    return ScheduleExceptionResponse.getPagination(total, scheduleExceptions);
  }

  async findOneScheduleExceptionResponseById(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    const scheduleException = await this.findOneById(specialistId, scheduleExceptionId, authenticatedUser);
    return ScheduleExceptionResponse.get(scheduleException);
  }

  async remove(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    const scheduleException = await this.findOneById(specialistId, scheduleExceptionId, authenticatedUser);
    scheduleException.isActive = false;
    await this.scheduleExceptionRepository.save(scheduleException);
    return ScheduleExceptionResponse.get(scheduleException);
  }

  private async findOneById(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { branch } = specialist;
    const branchFound = await this.findBranchById(branch.id);
    Permission.validateInSchedules(branchFound.company, authenticatedUser, specialist);
    const where = FormatScheduleQuery.get(specialistId, scheduleExceptionId);
    const scheduleException = await this.scheduleExceptionRepository.findOne({ where, relations: { specialist: true } });
    
    if(!scheduleException)
      throw new NotFoundException(`Schedule exception with '${ scheduleExceptionId }' not found`);
    
    return scheduleException;
  }

  private async saveScheduleException(specialist: Specialist, createScheduleExceptionDto: CreateScheduleExceptionDto) {
    await this.isScheduleExceptionConflict(specialist.id, createScheduleExceptionDto);

    try {
      const scheduleException = this.scheduleExceptionRepository.create({ ...createScheduleExceptionDto, specialist });
      await this.scheduleExceptionRepository.insert(scheduleException);
      return ScheduleExceptionResponse.get(scheduleException);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private async validateBookingExistence(specialistId: string, createScheduleExceptionDto: CreateScheduleExceptionDto) {
    const { date, startTime, endTime } = createScheduleExceptionDto;
    const booking = await this.dataSource
      .getRepository(Booking)
      .createQueryBuilder('booking')
      .where('booking.specialistId = :specialistId', { specialistId })
      .andWhere('booking.date = :date', { date })
      .andWhere('(booking.startTime < :endTime AND booking.endTime > :startTime)', { endTime, startTime })
      .andWhere('booking.status = :status', { status: AppointmentStatus.CONFIRMED })
      .getOne();

    if(booking)
      throw new BadRequestException(`There is already a booking for the specialist with '${ specialistId }' at the date '${ date }' between '${ startTime }' and '${ endTime }'`);
  }

  private async isScheduleExceptionConflict(specialistId: string, createScheduleExceptionDto: CreateScheduleExceptionDto) {
    const { date, startTime, endTime } = createScheduleExceptionDto;
    const scheduleException = await this.dataSource
      .getRepository(ScheduleException)
      .createQueryBuilder('schedule_exceptions')
      .where('schedule_exceptions.specialistId = :specialistId', { specialistId })
      .andWhere('schedule_exceptions.date = :date', { date })
      .andWhere('(schedule_exceptions.startTime < :endTime AND schedule_exceptions.endTime > :startTime)', { startTime, endTime })
      .andWhere('schedule_exceptions.isActive = true')
      .getOne();
  
    if(scheduleException)
      throw new BadRequestException('Schedule exception conflict. The specialist already has a schedule exception that overlaps with the provided time range on the same date.');
  }

  private async findBranchById(branchId: string) {
    const branch = await this.branchRepository.findOne({ where: { id: branchId, isActive: true }, relations: { company: true } });
    
    if(!branch)
      throw new NotFoundException(`Branch with '${ branchId }' not found`);
    
    return branch;
  }

  private validateDateAndTimes(createScheduleExceptionDto: CreateScheduleExceptionDto) {
    const today = this.getToday();
    const scheduleExceptionDate = createScheduleExceptionDto.date;

    if(scheduleExceptionDate <= today)
      throw new BadRequestException('Date must be greater than today');
    
    if(createScheduleExceptionDto.startTime && createScheduleExceptionDto.endTime) {
      const startTimeSchedule = this.getTimeToSecond(createScheduleExceptionDto.startTime);
      const endTimeSchedule = this.getTimeToSecond(createScheduleExceptionDto.endTime);
    
      if(startTimeSchedule >= endTimeSchedule)
        throw new BadRequestException('Start time must be before end time');
    }
  }

  private getTimeToSecond(hourString: string) {
    const hourArray = hourString.split(':').map(Number);
    return hourArray[0] * 3600 + hourArray[1] * 60;
  }

  private getToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    return `${year}-${month}-${day}`;
  }
}
