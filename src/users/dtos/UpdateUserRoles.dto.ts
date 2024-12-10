import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enums/role.enum";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateUserRolesDto {
  @IsNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({ example: [0, 1] })
  roles: UserRole[];
}