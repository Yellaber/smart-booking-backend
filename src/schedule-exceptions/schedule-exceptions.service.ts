import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole } from 'src/common/enums';
import { DbException, ScheduleQuery } from 'src/common/helpers';
import { Specialist } from 'src/specialists/entities/specialist.entity';
import { SpecialistsService } from 'src/specialists/specialists.service';
import { User } from 'src/users/entities/user.entity';
import { CreateScheduleExceptionDto, PaginationScheduleExceptionResponseDto, ScheduleExceptionResponseDto, UpdateScheduleExceptionDto } from './dto';
import { ScheduleException } from './entities/schedule-exception.entity';

// TODO - Lógica que maneje el solapamiento
@Injectable()
export class ScheduleExceptionsService {
  private readonly dbException = new DbException('ScheduleExceptionsService');

  constructor(
    private readonly specialistsService: SpecialistsService,
    @InjectRepository(ScheduleException)
    private readonly scheduleExceptionRepository: Repository<ScheduleException>,
  ) {}

  async createMyScheduleException(createScheduleExceptionDto: CreateScheduleExceptionDto, authenticatedUser: User) {
    // TODO - Validar si el Schedule Exception tiene el tipo 'block' y verificar si existen futuras citas entre startTime y endTime
    // TODO - Si existen citas lanzar un BadRequestException
    this.validateDateAndTimes(createScheduleExceptionDto);
    const specialist = await this.specialistsService.findOneByUserId(authenticatedUser);
    const scheduleException = await this.saveScheduleExceptionToCreate(specialist, createScheduleExceptionDto);
    return scheduleException;
  }

  async create(specialistId: string, createScheduleExceptionDto: CreateScheduleExceptionDto) {
    // TODO - Validar si el Schedule Exception tiene el tipo 'block' y verificar si existen futuras citas entre startTime y endTime
    // TODO - Si existen citas lanzar un BadRequestException
    this.validateDateAndTimes(createScheduleExceptionDto);
    const specialist = await this.specialistsService.findOneById(specialistId);
    const scheduleException = await this.saveScheduleExceptionToCreate(specialist, createScheduleExceptionDto);
    return scheduleException;
  }
  
  async findAllMyScheduleExceptions(paginationDto: PaginationDto, authenticatedUser: User) {
    const specialist = await this.specialistsService.findOneByUserId(authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ scheduleExceptions, total ] = await this.scheduleExceptionRepository.findAndCount({
      where: { specialist: { id: specialist.id } },
      take: limit,
      skip: offset
    });

    return this.getPaginationScheduleExceptionResponse(total, scheduleExceptions);
  }

  async findAll(specialistId: string, paginationDto: PaginationDto, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SPECIALIST))
      throw new ForbiddenException('User does not have permission to access this resource');
    
    await this.specialistsService.findOneById(specialistId);
    const where = ScheduleQuery.get(specialistId, authenticatedUser);
    const { limit = 10, offset = 0 } = paginationDto;
    const [ scheduleExceptions, total ] = await this.scheduleExceptionRepository.findAndCount({
      where,
      take: limit,
      skip: offset
    });
        
    return this.getPaginationScheduleExceptionResponse(total, scheduleExceptions);
  }

  async findOneScheduleExceptionResponse(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    if(authenticatedUser.roles.includes(UserRole.SPECIALIST))
      throw new ForbiddenException('User does not have permission to access this resource');

    await this.specialistsService.findOneById(specialistId);
    const scheduleException = await this.findOne(specialistId, scheduleExceptionId, authenticatedUser);
    return this.getScheduleExceptionResponse(scheduleException);
  }

  async updateMyScheduleException(scheduleExceptionId: string, updateScheduleExceptionDto: UpdateScheduleExceptionDto, authenticatedUser: User) {
    // TODO - Si el Schedule Exception es de tipo 'block' verifica si existen futuras citas entre startTime y endTime
    // TODO - Si existen citas lanzar un BadRequestException
    // TODO - Si el Schedule Exception es de tipo 'extra' verifica si existen citas completadas en date y entre startTime y endTime
    // TODO - Si existen citas lanzar un BadRequestException
    const meSpecialist = await this.specialistsService.findOneByUserId(authenticatedUser);
    return await this.saveScheduleExceptionToUpdate(meSpecialist.id, scheduleExceptionId, updateScheduleExceptionDto, authenticatedUser);
  }

  async update(specialistId: string, scheduleExceptionId: string, updateScheduleExceptionDto: UpdateScheduleExceptionDto, authenticatedUser: User) {
    // TODO - Si el Schedule Exception es de tipo 'block' verifica si existen futuras citas entre startTime y endTime
    // TODO - Si existen citas lanzar un BadRequestException
    // TODO - Si el Schedule Exception es de tipo 'extra' verifica si existen citas completadas en date y entre startTime y endTime
    // TODO - Si existen citas lanzar un BadRequestException
    await this.specialistsService.findOneById(specialistId);
    return await this.saveScheduleExceptionToUpdate(specialistId, scheduleExceptionId, updateScheduleExceptionDto, authenticatedUser);
  }

  async statusMyScheduleException(scheduleExceptionId: string, authenticatedUser: User) {
    const meSpecialist = await this.specialistsService.findOneByUserId(authenticatedUser);
    return await this.saveScheduleExceptionStatus(meSpecialist.id, scheduleExceptionId, authenticatedUser);
  }

  async status(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    await this.specialistsService.findOneById(specialistId);
    return await this.saveScheduleExceptionStatus(specialistId, scheduleExceptionId, authenticatedUser);
  }

  private async findOne(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    const where = ScheduleQuery.get(specialistId, authenticatedUser, scheduleExceptionId);
    const scheduleException = await this.scheduleExceptionRepository.findOne({
      where,
      relations: { specialist: true }
    });
    
    if(!scheduleException)
      throw new NotFoundException(`Schedule exception with '${ scheduleExceptionId }' not found`);
    
    return scheduleException;
  }

  private getScheduleExceptionResponse(scheduleException: ScheduleException): ScheduleExceptionResponseDto {
    const { isActive, specialist, ...restScheduleException } = scheduleException;
    return restScheduleException;
  }

  private async saveScheduleExceptionToCreate(specialist: Specialist, createScheduleExceptionDto: CreateScheduleExceptionDto) {
    try {
      const scheduleException = this.scheduleExceptionRepository.create({
        specialist,
        ...createScheduleExceptionDto
      });
      await this.scheduleExceptionRepository.save(scheduleException);
      return this.getScheduleExceptionResponse(scheduleException);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private async saveScheduleExceptionToUpdate(specialistId: string, scheduleExceptionId: string, updateScheduleExceptionDto: UpdateScheduleExceptionDto, 
                                              authenticatedUser: User) {
    const scheduleException = await this.findOne(specialistId, scheduleExceptionId, authenticatedUser);
    const scheduleExceptionUpdated = this.scheduleExceptionRepository.merge(scheduleException, updateScheduleExceptionDto);
    const { id, isActive, specialist, ...restScheduleException } = scheduleExceptionUpdated;
    this.validateDateAndTimes(restScheduleException);
    
    try {
      await this.scheduleExceptionRepository.save(scheduleExceptionUpdated);
      return this.getScheduleExceptionResponse(scheduleExceptionUpdated);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  private async saveScheduleExceptionStatus(specialistId: string, scheduleExceptionId: string, authenticatedUser: User) {
    const scheduleException = await this.findOne(specialistId, scheduleExceptionId, authenticatedUser);
    scheduleException.isActive = !scheduleException.isActive;
    await this.scheduleExceptionRepository.save(scheduleException);
    return this.getScheduleExceptionResponse(scheduleException);
  }

  private getPaginationScheduleExceptionResponse(total: number, scheduleExceptions: ScheduleException[]): PaginationScheduleExceptionResponseDto {
    const schedulesResponse = scheduleExceptions.map(schedule => this.getScheduleExceptionResponse(schedule));
    return { total, scheduleExceptions: schedulesResponse };
  }

  private validateDateAndTimes(createScheduleExceptionDto: CreateScheduleExceptionDto) {
    const today = this.getToday();
    const scheduleExceptionDate = createScheduleExceptionDto.date;

    if(scheduleExceptionDate <= today)
      throw new BadRequestException('Date must be greater than today');
    
    if(!this.validateTimes(createScheduleExceptionDto))
      throw new BadRequestException('Start time and end time must be null or time valid format at the same time');

    if(createScheduleExceptionDto.startTime && createScheduleExceptionDto.endTime) {
      const startTimeSchedule = this.getTimeToSecond(createScheduleExceptionDto.startTime);
      const endTimeSchedule = this.getTimeToSecond(createScheduleExceptionDto.endTime);
    
      if(startTimeSchedule >= endTimeSchedule)
        throw new BadRequestException('Start time must be before end time');
    }
  }

  private validateTimes(createScheduleExceptionDto: CreateScheduleExceptionDto) {
    const startTime = createScheduleExceptionDto.startTime;
    const endTime = createScheduleExceptionDto.endTime;
    return !!startTime === !!endTime;
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
