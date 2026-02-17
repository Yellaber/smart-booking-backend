import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { CommonModule } from './common/common.module';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SetupModule } from './setup/setup.module';
import { SpecialistsModule } from './specialists/specialists.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    BranchesModule,
    CommonModule,
    CompaniesModule,
    UsersModule,
    SchedulesModule,
    SetupModule,
    SpecialistsModule
  ]
})
export class AppModule {}
