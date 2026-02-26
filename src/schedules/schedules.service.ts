import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { ScheduleQuery } from 'src/common/helpers/schedule-query.helper';
import { SpecialistsService } from 'src/specialists/specialists.service';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleDto, PaginationScheduleResponseDto, ScheduleResponseDto, UpdateScheduleDto } from './dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  private readonly dbException = new DbException('SchedulesService');

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly specialistsService: SpecialistsService
  ) {}

  async create(specialistId: string, createScheduleDto: CreateScheduleDto) {
    const { startTime, endTime } = createScheduleDto;
    this.validateTimes(startTime, endTime);
    const specialist = await this.specialistsService.findOneById(specialistId);

    try {
      const schedule = this.scheduleRepository.create({
        specialist,
        ...createScheduleDto
      });
      await this.scheduleRepository.save(schedule);
      return this.getScheduleResponse(schedule);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(specialistId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SPECIALIST))
      throw new ForbiddenException('User does not have permission to access this resource');

    await this.specialistsService.findOneById(specialistId);
    const where = ScheduleQuery.get(specialistId, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ schedules, total ] = await this.scheduleRepository.findAndCount({
      where,
      take: limit,
      skip: offset
    });
    
    return this.getPaginationScheduleResponse(total, schedules);
  }

  async findAllMySchedules(paginationDto: PaginationDto, authenticatedUser: User) {
    const specialist = await this.specialistsService.findOneByUserId(authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ schedules, total ] = await this.scheduleRepository.findAndCount({
      where: { specialist: { id: specialist.id }, isActive: true },
      take: limit,
      skip: offset
    });

    return this.getPaginationScheduleResponse(total, schedules);
  }

  async findOneSheduleResponse(specialistId: string, scheduleId: string, authenticatedUser: User) {
    const schedule = await this.findOne(specialistId, scheduleId, authenticatedUser);
    return this.getScheduleResponse(schedule);
  }

  async update(specialistId: string, scheduleId: string, updateScheduleDto: UpdateScheduleDto, authenticatedUser: User) {
    // TODO - Buscar citas relacionadas con el ID del Schedule. Si existen, permitir actualización, de lo contrario lanzar un BadRequest.
    const schedule = await this.findOne(specialistId, scheduleId, authenticatedUser);
    const scheduleUpdated = this.scheduleRepository.merge(schedule, updateScheduleDto);
    const { startTime, endTime } = scheduleUpdated;
    this.validateTimes(startTime, endTime);

    try {
      await this.scheduleRepository.save(scheduleUpdated);
      return this.getScheduleResponse(scheduleUpdated);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async status(specialistId: string, scheduleId: string, authenticatedUser: User) {
    const schedule = await this.findOne(specialistId, scheduleId, authenticatedUser);
    schedule.isActive = !schedule.isActive;
    await this.scheduleRepository.save(schedule);
    return this.getScheduleResponse(schedule);
  }

  private async findOne(specialistId: string, scheduleId: string, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SPECIALIST))
      throw new ForbiddenException('User does not have permission to access this resource');

    await this.specialistsService.findOneById(specialistId);

    const where = ScheduleQuery.get(specialistId, authenticatedUser, scheduleId);    
    const schedule = await this.scheduleRepository.findOne({
      where,
      relations: { specialist: true }
    });

    if(!schedule)
      throw new NotFoundException(`Schedule with '${ scheduleId }' not found`);

    return schedule;
  }

  private getScheduleResponse(schedule: Schedule): ScheduleResponseDto {
    const { isActive, specialist, ...restSchedule } = schedule;
    return restSchedule;
  }

  private getPaginationScheduleResponse(total: number, schedules: Schedule[]): PaginationScheduleResponseDto {
    const schedulesResponse = schedules.map(schedule => this.getScheduleResponse(schedule));
    return { total, schedules: schedulesResponse };
  }

  private validateTimes(startTime: string, endTime: string) {
    const startTimeSchedule = this.getTimeToSecond(startTime);
    const endTimeSchedule = this.getTimeToSecond(endTime);
    
    if(startTimeSchedule >= endTimeSchedule)
      throw new BadRequestException('Start time must be before end time');
  }

  private getTimeToSecond(hourString: string) {
    const hourArray = hourString.split(':').map(Number);
    return hourArray[0] * 3600 + hourArray[1] * 60;
  }
}
