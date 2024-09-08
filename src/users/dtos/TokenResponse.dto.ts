import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;

  @ApiProperty()
  refreshToken: string;
}
