import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SpecialistsModule } from 'src/specialists/specialists.module';
import { ScheduleException } from './entities/schedule-exception.entity';
import { ScheduleExceptionsController } from './schedule-exceptions.controller';
import { ScheduleExceptionsService } from './schedule-exceptions.service';

@Module({
  controllers: [ ScheduleExceptionsController ],
  providers: [ ScheduleExceptionsService ],
  imports: [ 
    TypeOrmModule.forFeature([ ScheduleException ]),
    AuthModule,
    SpecialistsModule
  ],
  exports: [ ScheduleExceptionsService ]
})
export class ScheduleExceptionsModule {}
