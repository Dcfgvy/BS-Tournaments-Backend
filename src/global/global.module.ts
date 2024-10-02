import { Global, Module } from '@nestjs/common';
import { GlobalSettings } from '../services/settings/settings.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../typeorm/entities/Settings.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Settings])
  ],
  providers: [
    GlobalSettings
  ],
  exports: [
    GlobalSettings
  ]
})
export class GlobalModule {}
