import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    TypeOrmModule.forFeature([ Company ]),
    forwardRef(() => BranchesModule)
  ],
  exports: [CompaniesService]
})
export class CompaniesModule {}
