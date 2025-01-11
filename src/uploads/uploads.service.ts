import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger: Logger = new Logger(UploadsService.name);
  private readonly baseUploadDir = path.join(__dirname, '..', '..', 'uploaded');

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(this.baseUploadDir, 'images');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueFilename = String(new Date().getTime()) + uuidv4() + path.extname(file.originalname);
    const filePath = path.join(uploadsDir, uniqueFilename);
    await fs.writeFile(filePath, file.buffer);

    return `api/uploads/images/${uniqueFilename}`;
  }

  async fetchImage(filename: string, res?: Response): Promise<string> {
    const uploadsDir = path.join(this.baseUploadDir, 'images');
    const filePath = path.join(uploadsDir, filename);
    try {
      const fileContent = await fs.readFile(filePath);
      const mimeType = this.getMimeType(filename);

      if(res){
        // Set appropriate headers
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.status(HttpStatus.OK).send(fileContent);
      }

      return `data:${mimeType};base64,${fileContent.toString('base64')}`;
    } catch (err) {
      this.logger.warn(`Error reading file: ${filename}`, err);
      // returning default no-image picture
      const defaultImagePath = path.join(this.baseUploadDir, 'default-image.png');
      const defaultImageContent = await fs.readFile(defaultImagePath);
      
      if(res){
        // Set appropriate headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.status(HttpStatus.OK).send(defaultImageContent);
      }

      return `data:image/png;base64,${defaultImageContent.toString('base64')}`;
    }
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.png': return 'image/png';
      case '.jpg':
      case '.jpeg': return 'image/jpeg';
      case '.gif': return 'image/gif';
      default: return 'application/octet-stream'; // Fallback for unknown file types
    }
  }

  async deleteFile(filepath: string): Promise<boolean> {
    const absolutePath = path.join(this.baseUploadDir, filepath.replace('api/uploads/', '').replace('../', ''));
    try {
      await fs.unlink(absolutePath);
      return true;
    } catch (err) {
      this.logger.error(`Error deleting file: ${filepath}`, err);
      return false;
    }
  }
}
