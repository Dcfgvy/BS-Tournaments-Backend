import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './utils/appConfigs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger';
import { NodeEnv } from './utils/NodeEnv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: (appConfig.NODE_ENV === NodeEnv.DEV || appConfig.NODE_ENV === NodeEnv.TEST) ? undefined : false,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  setupSwagger(app);

  const PORT = appConfig.PORT;
  await app.listen(PORT, () => console.log(`Running in mode ${appConfig.NODE_ENV} on PORT ${PORT}`));
}
bootstrap();
