import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SubCategory } from './entities/subcategory.entity';
import { SubcategoriesController } from './subcategories.controller';
import { SubcategoriesService } from './subcategories.service';

@Module({
  controllers: [ SubcategoriesController ],
  providers: [ SubcategoriesService ],
  imports: [
    TypeOrmModule.forFeature([ SubCategory ]),
    AuthModule
  ],
  exports: [ SubcategoriesService ]
})
export class SubcategoriesModule {}
