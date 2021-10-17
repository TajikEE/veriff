import { IsNotEmpty } from 'class-validator';

export class ImportWalletDto {
  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly exchange: string;

  @IsNotEmpty()
  readonly accessToken: string;
}
