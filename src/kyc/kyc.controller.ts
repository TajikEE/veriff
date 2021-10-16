import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycVerificationDto } from './dto/kyc-verification.dto';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async kycVerification(
    @Req() req: Request,
    @Body() kycVerificationDto: KycVerificationDto,
  ) {
    return await this.kycService.startVerification(kycVerificationDto);
  }
}
