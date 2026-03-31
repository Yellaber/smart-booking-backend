import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BranchesModule } from 'src/branches/branches.module';
import { Service } from 'src/services/entities/service.entity';
import { UsersModule } from 'src/users/users.module';
import { Specialist } from './entities/specialist.entity';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';

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
