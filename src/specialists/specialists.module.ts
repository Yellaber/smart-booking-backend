import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BranchesModule } from 'src/branches/branches.module';
import { UsersModule } from 'src/users/users.module';
import { Specialist } from './entities/specialist.entity';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';

@Module({
  controllers: [ SpecialistsController ],
  providers: [ SpecialistsService ],
  imports: [
    TypeOrmModule.forFeature([ Specialist ]),
    AuthModule,
    BranchesModule,
    UsersModule
  ],
  exports: [ SpecialistsService ]
})
export class SpecialistsModule {}
