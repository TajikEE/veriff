import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetBalanceDto } from './dto/get-balance.dto';
import { ImportWalletDto } from './dto/import-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/:userId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async checkBalance(@Param() getBalanceDto: GetBalanceDto) {
    return await this.walletService.getBalance(getBalanceDto);
  }

  @Post('/import')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async importWallet(@Body() importWalletDto: ImportWalletDto) {
    return await this.walletService.importWallet(importWalletDto);
  }
}
