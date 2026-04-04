import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException, FormatScheduleQuery, HandlerDate, Permission } from 'src/common/helpers';
import { SpecialistsService } from 'src/specialists/specialists.service';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleDto } from './dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleResponse } from './helpers/schedule-response.helper';

@Injectable()
export class SchedulesService {
  private readonly dbException = new DbException('SchedulesService');

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly dataSource: DataSource,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly specialistsService: SpecialistsService
  ) {}

  async create(specialistId: string, createScheduleDto: CreateScheduleDto, authenticatedUser: User) {
    this.validateTimes(createScheduleDto);
    const specialist = await this.specialistsService.findOneById(specialistId);
    const { branch } = specialist;
    const branchFound = await this.findBranchById(branch.id);
    Permission.validateSpecialist(branchFound.company, authenticatedUser, specialist);
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
    const { branch } = specialist;
    const branchFound = await this.findBranchById(branch.id);
    Permission.validateSpecialist(branchFound.company, authenticatedUser, specialist);
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
    const { branch } = specialist;
    const branchFound = await this.findBranchById(branch.id);
    Permission.validateSpecialist(branchFound.company, authenticatedUser, specialist);
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

  private async findBranchById(branchId: string) {
    const branch = await this.branchRepository.findOne({ where: { id: branchId, isActive: true }, relations: { company: true } });
    
    if(!branch)
      throw new NotFoundException(`Branch with '${ branchId }' not found`);
    
    return branch;
  }

  private validateTimes(createScheduleDto: CreateScheduleDto) {
    const { startTime, endTime } = createScheduleDto;
    const startTimeSchedule = HandlerDate.transformTimeToSecond(startTime);
    const endTimeSchedule = HandlerDate.transformTimeToSecond(endTime);
    
    if(startTimeSchedule >= endTimeSchedule)
      throw new BadRequestException('Start time must be before end time');
  }
}
