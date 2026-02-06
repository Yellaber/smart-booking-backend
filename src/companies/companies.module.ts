import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

@Module({
  controllers: [ CompaniesController ],
  providers: [ CompaniesService ],
  imports: [
    TypeOrmModule.forFeature([ Company ]),
    forwardRef(() => AuthModule)
  ],
  exports: [ CompaniesService ]
})
export class CompaniesModule {}
