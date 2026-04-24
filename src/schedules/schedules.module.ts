import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SpecialistsModule } from '../specialists/specialists.module';
import { Schedule } from './entities/schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  controllers: [ SchedulesController ],
  providers: [ SchedulesService ],
  imports: [
    TypeOrmModule.forFeature([ Schedule ]),
    AuthModule,
    SpecialistsModule
  ],
  exports: [ SchedulesService ]
})
export class SchedulesModule {}
