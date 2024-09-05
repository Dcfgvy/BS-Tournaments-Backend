import { Global, Module } from '@nestjs/common';
import { SettingsService } from '../services/settings/settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../typeorm/entities/Settings.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Settings])
  ],
  providers: [
    SettingsService
  ],
  exports: [
    SettingsService
  ]
})
export class GlobalModule {}
