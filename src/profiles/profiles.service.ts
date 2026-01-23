import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DbException } from 'src/common/helpers/db-exception.helper';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  private readonly dbException = new DbException('ProfilesService');

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      const profile = this.profileRepository.create(createProfileDto);
      await this.profileRepository.save(profile);
      return this.planProfile(profile);
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [ profiles, total ] = await this.profileRepository.findAndCount({
      take: limit,
      skip: offset,
      // relations: { users: true }
    });

    const profilesPlan = profiles.map(this.planProfile);
    return { total, profiles: profilesPlan };
  }

  async findOne(term: string) {
    const query = isUUID(term)? { id: term }: { idNumber: term };
    const profile = await this.profileRepository.findOne({
      where: query,
      // relations: { users: true }
    });
    
    if(!profile)
      throw new NotFoundException(`Profile with '${ term }' not found`);
    return profile;
  }

  async findOnePlan(term: string) {
    const profile = await this.findOne(term);
    return this.planProfile(profile);
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.preload({
      id,
      ...updateProfileDto,
    });

    if(!profile)
      throw new NotFoundException(`Profile with id '${ id }' not found`);

    try {
      await this.profileRepository.save(profile);
      return this.planProfile(profile);
    } catch(error) {
      this.dbException.handle(error);
    }
  }

  private planProfile(profile: Profile) {
    const { createdAt: profileCreatedAt, updatedAt: profileUpdatedAt, ...restProfile } = profile;
  
    // if(!users) {
    //   return { 
    //     ...restProfile,
    //     users: []
    //   };
    // }
  
    return {
      ...restProfile,
      // users: users.map(user => {
      //   const { profile, createdAt: profileCreatedAt, updatedAt: profileUpdatedAt, ...restProfile } = profile;
      //   return restProfile;
      // })
    };
  }
}
