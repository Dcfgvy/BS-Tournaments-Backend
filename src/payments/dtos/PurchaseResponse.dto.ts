import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/users/dtos/UserResponse.dto";

export class PurchaseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Organizer role' })
  type: string;

  @ApiProperty({ example: 200 })
  cost: number;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}