import { IsNotEmpty } from 'class-validator';

export class GetBalanceDto {
  @IsNotEmpty()
  readonly userId: string;
}
