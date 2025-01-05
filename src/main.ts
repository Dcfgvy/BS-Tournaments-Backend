import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './utils/appConfigs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger';
import { NodeEnv } from './utils/NodeEnv';
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: (appConfig.NODE_ENV === NodeEnv.DEV || appConfig.NODE_ENV === NodeEnv.TEST) ? undefined : false,
  });

  app.use(helmet());
  if(appConfig.NODE_ENV === NodeEnv.DEV){
    app.enableCors({
      origin: 'http://localhost:4200', // Allow frontend
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true, // Allow cookies
    });
  }

  // Middleware for allowing all origins on `/api/webhooks/*`
  app.use('/api/webhooks', (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  setupSwagger(app);

  const PORT = appConfig.PORT;
  await app.listen(PORT, () => console.log(`Running in mode ${appConfig.NODE_ENV} on PORT ${PORT}`));
}
bootstrap();
