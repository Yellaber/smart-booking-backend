import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger( 'BootStrap' );
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix( 'api/v1' );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle( 'Smart Booking RESTful API' )
    .setDescription( 'Smart Booking Endpoint Documentation' )
    .setVersion( '1.0' )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
  logger.log( `App running on: ${ await app.getUrl() }` );
}
void bootstrap();
