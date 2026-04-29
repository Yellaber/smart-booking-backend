import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsModule } from './assesments/assessments.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { BranchesModule } from './branches/branches.module';
import { CommonModule } from './common/common.module';
import { CompaniesModule } from './companies/companies.module';
import { CountriesModule } from './countries/countries.module';
import { ScheduleExceptionsModule } from './schedule-exceptions/schedule-exceptions.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ServicesModule } from './services/services.module';
import { SetupModule } from './setup/setup.module';
import { SpecialistsModule } from './specialists/specialists.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';

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
    AssessmentsModule,
    AuthModule,
    BookingsModule,
    BranchesModule,
    CommonModule,
    CompaniesModule,
    CountriesModule,
    ScheduleExceptionsModule,
    SchedulesModule,
    ServicesModule,
    SetupModule,
    SpecialistsModule,
    UsersModule,
    CategoriesModule,
    SubcategoriesModule,
  ]
})
export class AppModule {}
