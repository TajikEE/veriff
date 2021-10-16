import { IsNotEmpty, MinLength } from 'class-validator';

export class KycVerificationDto {
  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  @MinLength(5)
  readonly idNumber: string;

  @IsNotEmpty()
  readonly dateOfBirth: Date;

  @IsNotEmpty()
  readonly docNumber: string;

  @IsNotEmpty()
  readonly docType: string;

  @IsNotEmpty()
  readonly country: string;
}
