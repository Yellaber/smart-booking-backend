import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { SpecialistsModule } from 'src/specialists/specialists.module';
import { Schedule } from './entities/schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  controllers: [ SchedulesController ],
  providers: [ SchedulesService ],
  imports: [
    TypeOrmModule.forFeature([ Branch, Schedule ]),
    AuthModule,
    SpecialistsModule
  ],
  exports: [ SchedulesService ]
})
export class SchedulesModule {}
