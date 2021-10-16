import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly password: string;
}
