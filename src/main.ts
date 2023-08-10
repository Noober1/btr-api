import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // session provider
  app.use(
    session({
      secret: 'k4cung',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // passport js
  app.use(passport.initialize());
  app.use(passport.session());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('BTR API')
    .setDescription('SMK Bina Taruna Jalancagak API')
    .setVersion('1.0')
    .addBearerAuth({
      bearerFormat: 'JWT',
      scheme: 'bearer',
      type: 'http',
      name: 'Authentication',
      description:
        'Untuk mendapatkan akses token. Silahkan untuk login terlebih dahulu pada API POST /auth/login',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT).then(() => console.log(`Starting on port ${PORT}`));
}
bootstrap();
