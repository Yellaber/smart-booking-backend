import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BranchesModule } from '../branches/branches.module';
import { Service } from '../services/entities/service.entity';
import { UsersModule } from '../users/users.module';
import { Specialist } from './entities/specialist.entity';
import { SpecialistsController } from './specialists.controller';
import { SpecialistsService } from './specialists.service';

@Module({
  controllers: [ SpecialistsController ],
  providers: [ SpecialistsService ],
  imports: [
    TypeOrmModule.forFeature([ Specialist, Service ]),
    AuthModule,
    BranchesModule,
    UsersModule
  ],
  exports: [ SpecialistsService ]
})
export class SpecialistsModule {}
