import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './interfaces/wallet.interface';
import { apiResponse } from '../utils/api-response';
import { GetBalanceDto } from './dto/get-balance.dto';
import { ImportWalletDto } from './dto/import-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet') private readonly walletModel: Model<Wallet>,
  ) {}

  async getBalance(getBalanceDto: GetBalanceDto) {
    const wallet = await this.walletModel.findOne({
      userId: getBalanceDto.userId,
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    return apiResponse(true, { wallet });
  }

  async importWallet(importWalletDto: ImportWalletDto) {
    const walletData = await this.fakeCryptoService(
      importWalletDto.accessToken,
      importWalletDto.exchange,
    );

    const existingWallet = await this.walletModel.findOne({
      userId: importWalletDto.userId,
    });

    if (existingWallet) {
      existingWallet.network = walletData.network;
      existingWallet.balance = walletData.balance;

      await existingWallet.save();

      return apiResponse(true, { wallet: existingWallet });
    }

    const importedWallet = new this.walletModel({
      userId: importWalletDto.userId,
      network: walletData.network,
      balance: walletData.balance,
    });
    await importedWallet.save();

    return apiResponse(true, { wallet: importedWallet });
  }

  fakeCryptoService(accessToken, exchange) {
    // assume it makes request to some external api with accessToken and exchange
    return {
      exchange: 'binance',
      balance: Math.floor(Math.random() * 99) + 1,
      network: 'ethereum',
    };
  }
}
