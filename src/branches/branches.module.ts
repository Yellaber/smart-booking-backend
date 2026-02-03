import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  controllers: [ BranchesController ],
  providers: [ BranchesService ],
  imports: [
    TypeOrmModule.forFeature([ Branch ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.registerAsync({
        imports: [ ConfigModule ],
        inject: [ ConfigService ],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' }
      })
    }),
    CompaniesModule
  ],
  exports: [ BranchesService ]
})
export class BranchesModule {}
