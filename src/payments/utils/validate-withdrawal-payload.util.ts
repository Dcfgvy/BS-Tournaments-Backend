import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CryptoBotWithdrawalDto } from '../dtos/CryptoBotWithdrawal.dto';

export async function validatePayload(method: string, data: any): Promise<void> {
  let dtoClass;

  switch (method) {
    case 'crypto-bot':
      dtoClass = CryptoBotWithdrawalDto;
      break;
    default:
      throw new HttpException('Unsupported withdrawal method', HttpStatus.NOT_IMPLEMENTED);
  }

  // Transform and validate
  const dtoInstance = plainToInstance(dtoClass, data);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    throw new HttpException(
      errors.map(err => Object.values(err.constraints).join(', ')).join('; '),
      HttpStatus.BAD_REQUEST,
    );
  }
}
