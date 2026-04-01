import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
