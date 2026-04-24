import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BranchesModule } from '../branches/branches.module';
import { Service } from '../services/entities/service.entity';
import { Specialist } from '../specialists/entities/specialist.entity';
import { User } from '../users/entities/user.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';

@Module({
  controllers: [ BookingsController ],
  providers: [ BookingsService ],
  imports: [
    TypeOrmModule.forFeature([ Booking, Service, Specialist, User ]),
    AuthModule,
    BranchesModule
  ],
  exports: [ BookingsService ]
})
export class BookingsModule {}
