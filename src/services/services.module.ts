import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BranchesModule } from 'src/branches/branches.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';

@Module({
  controllers: [ ServicesController ],
  providers: [ ServicesService ],
  imports: [
    TypeOrmModule.forFeature([ Service ]),
    AuthModule,
    BranchesModule
  ],
  exports: [ ServicesService ]
})
export class ServicesModule {}
