import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ UsersController ],
  providers: [ UsersService ],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ User ]),
    AuthModule,
    CompaniesModule
  ],
  exports: [ UsersService ]
})
export class UsersModule {}
