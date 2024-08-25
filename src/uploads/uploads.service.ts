import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(__dirname, 'uploaded', 'images');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    await fs.writeFile(filePath, file.buffer);

    return `uploads/images/${uniqueFilename}`;
  }

  async fetchImage(filename: string): Promise<string> {
    const uploadsDir = path.join(__dirname, 'uploaded', 'images');
    const filePath = path.join(uploadsDir, filename);
    try{
      const fileContent = await fs.readFile(filePath);
      return fileContent.toString('base64');
    } catch (err) {
      console.error(`Error reading file: ${filename}`, err);
      return null;
    }
  }

  async deleteFile(filepath: string): Promise<boolean> {
    const absolutePath = path.join(__dirname, filepath);
    try {
      await fs.rm(absolutePath);
      return true;
    } catch (err) {
      console.error(`Error deleting file: ${filepath}`, err);
      return false;
    }
  }
}
