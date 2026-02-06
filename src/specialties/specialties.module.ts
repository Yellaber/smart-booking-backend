import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { Specialty } from './entities/specialty.entity';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesController } from './specialties.controller';

@Module({
  controllers: [ SpecialtiesController ],
  providers: [ SpecialtiesService ],
  imports: [ 
    TypeOrmModule.forFeature([ Specialty ]),
    AuthModule,
    CompaniesModule
  ],
  exports: [ SpecialtiesService ]
})
export class SpecialtiesModule {}
