import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: '#TAG123', description: 'BS tag' })
  tag: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 0.0, description: 'Balance' })
  balance: number;

  @ApiProperty({ example: 'ru', description: 'User language' })
  language: string;

  @ApiProperty({ example: [1, 2], description: 'User roles' })
  roles: number[];

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'User ban ending date',
  })
  bannedUntil: Date;
}
