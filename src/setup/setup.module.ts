import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SetupService } from './setup.service';
import { SetupController } from './setup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [ SetupController ],
  providers: [ SetupService ],
  imports: [ 
    TypeOrmModule.forFeature([ Company, User ]),
    ConfigModule
  ],
  exports: [ SetupService ]
})
export class SetupModule {}
