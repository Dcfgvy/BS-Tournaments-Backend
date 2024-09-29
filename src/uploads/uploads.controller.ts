import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { AdminGuard } from '../users/guards/admin.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@SkipThrottle()
@Controller('uploads')
@ApiTags('Uploads')
export class UploadsController {
  constructor(
    private uploadService: UploadsService
  ){}

  @Post('images')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    }
  })
  uploadImage(@UploadedFile('file') file: Express.Multer.File){
    return this.uploadService.uploadImage(file);
  }

  @Get('images/:filename')
  getImage(@Param('filename') filename: string){
    return this.uploadService.fetchImage(filename);
  }
}
