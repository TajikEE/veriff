import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  @IsUUID()
  readonly verification: string;
}
