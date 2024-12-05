import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger: Logger = new Logger(UploadsService.name);
  private readonly baseUploadDir = path.join(__dirname, '..', '..', 'uploads');

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(this.baseUploadDir, 'images');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueFilename = String(new Date().getTime()) + uuidv4() + path.extname(file.originalname);
    const filePath = path.join(uploadsDir, uniqueFilename);
    await fs.writeFile(filePath, file.buffer);

    return `uploads/images/${uniqueFilename}`;
  }

  async fetchImage(filename: string): Promise<string> {
    const uploadsDir = path.join(this.baseUploadDir, 'images');
    const filePath = path.join(uploadsDir, filename);
    try {
      const fileContent = await fs.readFile(filePath);
      return fileContent.toString('base64');
    } catch (err) {
      this.logger.error(`Error reading file: ${filename}`, err);
      return null;
    }
  }

  async deleteFile(filepath: string): Promise<boolean> {
    const absolutePath = path.join(this.baseUploadDir, filepath);
    try {
      await fs.unlink(absolutePath);
      return true;
    } catch (err) {
      this.logger.error(`Error deleting file: ${filepath}`, err);
      return false;
    }
  }
}
