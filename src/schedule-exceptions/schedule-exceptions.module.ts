import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { SpecialistsModule } from 'src/specialists/specialists.module';
import { ScheduleException } from './entities/schedule-exception.entity';
import { ScheduleExceptionsController } from './schedule-exceptions.controller';
import { ScheduleExceptionsService } from './schedule-exceptions.service';

@Module({
  controllers: [ ScheduleExceptionsController ],
  providers: [ ScheduleExceptionsService ],
  imports: [ 
    TypeOrmModule.forFeature([ Branch, ScheduleException ]),
    AuthModule,
    SpecialistsModule
  ],
  exports: [ ScheduleExceptionsService ]
})
export class ScheduleExceptionsModule {}
