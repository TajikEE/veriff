import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  readonly name: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  readonly password: string;
}
