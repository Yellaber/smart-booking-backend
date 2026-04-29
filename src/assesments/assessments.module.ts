import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BranchesModule } from '../branches/branches.module';
import { UsersModule } from '../users/users.module';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { Assessment } from './entities/assessment.entity';

@Module({
  controllers: [ AssessmentsController ],
  providers: [ AssessmentsService ],
  imports: [
    TypeOrmModule.forFeature([ Assessment ]),
    AuthModule,
    BranchesModule,
    UsersModule
  ],
  exports: [ AssessmentsService ]
})
export class AssessmentsModule {}
