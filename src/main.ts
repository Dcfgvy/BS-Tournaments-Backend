import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './utils/appConfigs';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);

  const PORT = appConfig.PORT;
  await app.listen(PORT, () => console.log(`Running in mode ${appConfig.NODE_ENV} on PORT ${PORT}`));
}
bootstrap();
