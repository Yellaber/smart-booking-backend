import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from './entities/country.entity';

@Module({
  controllers: [ CountriesController ],
  providers: [ CountriesService ],
  imports: [ 
    TypeOrmModule.forFeature([ Country ]),
    AuthModule
  ],
  exports: [ CountriesService ]
})
export class CountriesModule {}
