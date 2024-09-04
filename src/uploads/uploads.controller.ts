import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { AdminGuard } from '../users/guards/admin.guard';

@SkipThrottle()
@Controller('uploads')
export class UploadsController {
  constructor(
    private uploadService: UploadsService
  ){}

  @Post('images')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File){
    return this.uploadService.uploadImage(file);
  }

  @Get('images/:filename')
  getImage(@Param('filename') filename: string){
    return this.uploadService.fetchImage(filename);
  }
}
