import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

@Module({
  controllers: [ CompaniesController ],
  providers: [ CompaniesService ],
  imports: [
    TypeOrmModule.forFeature([ Company ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.registerAsync({
        imports: [ ConfigModule ],
        inject: [ ConfigService ],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' }
      })
    }),
  ],
  exports: [ CompaniesService ]
})
export class CompaniesModule {}
