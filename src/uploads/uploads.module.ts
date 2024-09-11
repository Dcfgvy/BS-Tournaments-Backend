import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [UploadsController],
  providers: [
    UploadsService,
    
  ],
  exports: [
    UploadsService
  ]
})
export class UploadsModule {}
