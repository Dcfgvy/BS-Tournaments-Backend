import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './utils/appConfigs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger';
import { NodeEnv } from './utils/NodeEnv';

async function bootstrap() {
  setInterval(() => {
    console.log(appConfig.REDIS_HOST);
    console.log(appConfig.REDIS_PORT);
  }, 2000);

  const app = await NestFactory.create(AppModule, {
    logger: (appConfig.NODE_ENV === NodeEnv.DEV) ? undefined : false,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);

  const PORT = appConfig.PORT;
  await app.listen(PORT, () => console.log(`Running in mode ${appConfig.NODE_ENV} on PORT ${PORT}`));
}
bootstrap();
