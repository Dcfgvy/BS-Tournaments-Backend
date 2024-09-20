import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TagUpperCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && value.tag) {
      value.tag = value.tag.toUpperCase();
    }
    return value;
  }
}