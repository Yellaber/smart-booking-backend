import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
  controllers: [ CategoriesController ],
  providers: [ CategoriesService ],
  imports: [
    TypeOrmModule.forFeature([ Category ]),
    AuthModule
  ],
  exports: [ CategoriesService ]
})
export class CategoriesModule {}
