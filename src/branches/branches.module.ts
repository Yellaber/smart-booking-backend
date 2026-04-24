import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from '../companies/companies.module';
import { CountriesModule } from '../countries/countries.module';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';

@Module({
  controllers: [ BranchesController ],
  providers: [ BranchesService ],
  imports: [
    TypeOrmModule.forFeature([ Branch ]),
    AuthModule,
    CompaniesModule,
    CountriesModule
  ],
  exports: [ BranchesService ]
})
export class BranchesModule {}
