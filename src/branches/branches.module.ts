import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ BranchesController ],
  providers: [ BranchesService ],
  imports: [
    TypeOrmModule.forFeature([ Branch ]),
    AuthModule,
    CompaniesModule
  ],
  exports: [ BranchesService ]
})
export class BranchesModule {}
