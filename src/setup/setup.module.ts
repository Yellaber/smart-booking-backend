import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SetupService } from './setup.service';
import { SetupController } from './setup.controller';

@Module({
  controllers: [ SetupController ],
  providers: [ SetupService ],
  imports: [ ConfigModule ],
  exports: [ SetupService ]
})
export class SetupModule {}
