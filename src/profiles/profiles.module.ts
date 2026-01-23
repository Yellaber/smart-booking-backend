import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from './entities/profile.entity';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    TypeOrmModule.forFeature([ Profile ]),
  ]
})
export class ProfilesModule {}
