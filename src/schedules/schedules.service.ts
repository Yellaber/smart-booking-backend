import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { DbException, FormatScheduleQuery, HandlerDate, Permission } from '../common/helpers';
import { SpecialistsService } from '../specialists/specialists.service';
import { User } from '../users/entities/user.entity';
import { CreateScheduleDto } from './dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleResponse } from './helpers/schedule-response.helper';

@Injectable()
export class SchedulesService {
  private readonly dbException = new DbException('SchedulesService');

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly specialistsService: SpecialistsService
  ) {}

  async create(specialistId: string, createScheduleDto: CreateScheduleDto, authenticatedUser: User) {
    this.validateTimes(createScheduleDto);
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { company } = specialist.branch;
    Permission.validateSpecialist(company, authenticatedUser, specialist);
    await this.isScheduleConflict(specialistId, createScheduleDto);

    try {
      const schedule = this.scheduleRepository.create({ ...createScheduleDto, specialist });
      await this.scheduleRepository.insert(schedule);
      return ScheduleResponse.get(schedule);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(specialistId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { company } = specialist.branch;
    Permission.validateSpecialist(company, authenticatedUser, specialist);
    const where = FormatScheduleQuery.get(specialistId);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ schedules, total ] = await this.scheduleRepository.findAndCount({ where, take: limit, skip: offset });
    return ScheduleResponse.getPagination(total, schedules);
  }

  async findOneSheduleResponseById(specialistId: string, scheduleId: string, authenticatedUser: User) {
    const schedule = await this.findOneById(specialistId, scheduleId, authenticatedUser);
    return ScheduleResponse.get(schedule);
  }

  async remove(specialistId: string, scheduleId: string, authenticatedUser: User) {
    const schedule = await this.findOneById(specialistId, scheduleId, authenticatedUser);
    schedule.isActive = false;
    await this.scheduleRepository.save(schedule);
    return ScheduleResponse.get(schedule);
  }

  private async findOneById(specialistId: string, scheduleId: string, authenticatedUser: User) {
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { company } = specialist.branch;
    Permission.validateSpecialist(company, authenticatedUser, specialist);
    const where = FormatScheduleQuery.get(specialistId, scheduleId);
    const schedule = await this.scheduleRepository.findOne({ where, relations: { specialist: true } });

    if(!schedule)
      throw new NotFoundException(`Schedule with '${ scheduleId }' not found`);

    return schedule;
  }

  private async isScheduleConflict(specialistId: string, createScheduleDto: CreateScheduleDto) {
    const { dayOfWeek, startTime, endTime } = createScheduleDto;
    const schedule = await this.dataSource
      .getRepository(Schedule)
      .createQueryBuilder('schedule')
      .where('schedule.specialistId = :specialistId', { specialistId })
      .andWhere('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('(schedule.startTime < :endTime AND schedule.endTime > :startTime)', { startTime, endTime })
      .andWhere('schedule.isActive = true')
      .getOne();

    if(schedule)
      throw new BadRequestException('Schedule conflict. The specialist already has a schedule that overlaps with the provided time range on the same day of the week');
  }

  private validateTimes(createScheduleDto: CreateScheduleDto) {
    const { startTime, endTime } = createScheduleDto;
    const startTimeSchedule = HandlerDate.transformTimeToSecond(startTime);
    const endTimeSchedule = HandlerDate.transformTimeToSecond(endTime);
    
    if(startTimeSchedule >= endTimeSchedule)
      throw new BadRequestException('Start time must be before end time');
  }
}
