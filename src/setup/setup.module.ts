import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  controllers: [ SetupController ],
  providers: [ SetupService ],
  imports: [ ConfigModule ],
  exports: [ SetupService ]
})
export class SetupModule {}
