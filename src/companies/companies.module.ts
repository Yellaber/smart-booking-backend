import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

@Module({
  controllers: [ CompaniesController ],
  providers: [ CompaniesService ],
  imports: [
    TypeOrmModule.forFeature([ Company, SubCategory ]),
    forwardRef(() => AuthModule)
  ],
  exports: [ CompaniesService ]
})
export class CompaniesModule {}
