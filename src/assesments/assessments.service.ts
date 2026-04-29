import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbException } from '../common/helpers';
import { BranchesService } from '../branches/branches.service';
import { UsersService } from '../users/users.service';
import { Assessment } from './entities/assessment.entity';
import { AssessmentParameters } from './interfaces/assessment-parameters.interface';
import { AssessmentResponse } from './helpers/assessment-response.helper';

@Injectable()
export class AssessmentsService {
  private readonly dbException = new DbException('AssessmentsService');

  constructor(
    private readonly branchesService: BranchesService,
    private readonly usersService: UsersService,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>
  ) {}

  async create(assessmentParameters: AssessmentParameters) {
    const { branchId, userId, createAssessmentDto, authenticatedUser } = assessmentParameters;
    const branch = await this.branchesService.findOneById(branchId, authenticatedUser);
    const { company } = branch;
    const user = await this.usersService.findOne(company.id, userId, authenticatedUser);

    try {
      const assessment = this.assessmentRepository.create({ ...createAssessmentDto, branch, user });
      await this.assessmentRepository.save(assessment);
      return AssessmentResponse.get(assessment);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async findAll(assessmentParameters: AssessmentParameters) {
    const { branchId, userId, paginationDto, authenticatedUser } = assessmentParameters;
    const branch = await this.branchesService.findOneById(branchId, authenticatedUser);
    const { company } = branch;
    const user = await this.usersService.findOne(company.id, userId, authenticatedUser);

    if(!paginationDto)
      throw new BadRequestException('Pagination parameters are required to get assessments');

    const { limit = 10, offset = 0 } = paginationDto;
    const [ assessments, total ] = await this.assessmentRepository.findAndCount({
      where: { branch: { id: branch.id }, user: { id: user.id }, isActive: true },
      take: limit,
      skip: offset
    });
    
    return AssessmentResponse.getPagination(total, assessments);
  }

  async findOneById(assessmentParameters: AssessmentParameters) {
    const assessment = await this.findOne(assessmentParameters);
    return AssessmentResponse.get(assessment);
  }

  async update(assessmentParameters: AssessmentParameters) {
    const assessmentFound = await this.findOne(assessmentParameters);
    const { updateAssessmentDto } = assessmentParameters;

    if(!updateAssessmentDto)
      throw new BadRequestException('Update parameters are required to update assessment');

    const assessment = this.assessmentRepository.merge(assessmentFound, updateAssessmentDto);

    try {
      await this.assessmentRepository.save(assessment);
      return AssessmentResponse.get(assessment);
    } catch(error) {
      return this.dbException.handle(error);
    }
  }

  async remove(assessmentParameters: AssessmentParameters) {
    const assessment = await this.findOne(assessmentParameters);
    assessment.isActive = false;
    await this.assessmentRepository.save(assessment);
  }

  async findOne(assessmentParameters: AssessmentParameters) {
    const { branchId, userId, assessmentId, authenticatedUser } = assessmentParameters;
    const branch = await this.branchesService.findOneById(branchId, authenticatedUser);
    const { company } = branch;

    if(!assessmentId)
      throw new BadRequestException('assessmentId is required to get assessment');

    const user = await this.usersService.findOne(company.id, userId, authenticatedUser);
    const assessment = await this.assessmentRepository.findOne(
      { where: { id: assessmentId, branch: { id: branch.id }, user: { id: user.id }, isActive: true } }
    );

    if(!assessment)
      throw new NotFoundException(`Assessment with '${ assessmentId }' not found for this branch and user`);

    return assessment;
  }
}
