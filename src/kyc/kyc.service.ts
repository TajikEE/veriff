import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionResponse } from './dto/create-session-response.dto';
import { createServiceClient } from '../utils/client/got.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import crypto from 'crypto';
import { User } from '../users/interfaces/user.interface';
import { KycVerificationDto } from './dto/kyc-verification.dto';
import { Kyc } from './interfaces/kyc.interface';
import { DecisionResponse } from './dto/decision-response.dto';
import { ApiResponse, apiResponse } from '../utils/api-response';

const VERIFF_BASE_URL = 'https://stationapi.veriff.com/v1/';
@Injectable()
export class KycService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Kyc') private readonly kycModel: Model<Kyc>,
  ) {}

  client = createServiceClient(VERIFF_BASE_URL);

  generateSignature(payload: string, secret: string) {
    return crypto
      .createHmac('sha256', secret)
      .update(Buffer.from(payload, 'utf8'))
      .digest('hex')
      .toLowerCase();
  }

  async startVerification(
    kycVerificationDto: KycVerificationDto,
  ): Promise<ApiResponse> {
    const user = await this.userModel.findOne({
      _id: kycVerificationDto.userId,
      verified: true,
    });

    const body = {
      verification: {
        callback: `${process.env.APP_URL}/login`,
        person: {
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1],
          idNumber: kycVerificationDto.idNumber,
          dateOfBirth: kycVerificationDto.dateOfBirth,
        },
        document: {
          number: kycVerificationDto.docNumber,
          type: kycVerificationDto.docType,
          country: kycVerificationDto.country,
        },
        timestamp: this.timestamp(),
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': process.env.VERIFF_API_PUBLIC_KEY,
    };

    const options = {
      headers,
      body,
    };

    try {
      const res = await this.client<CreateSessionResponse>(
        'post',
        'sessions',
        options,
      );

      const kyc: Kyc = await this.kycModel.create({
        userId: kycVerificationDto.userId,
        sessionId: res.verification.id,
        url: res.verification.url,
      });

      return apiResponse(true, { kycUrl: kyc.url });
    } catch (ex) {
      throw new BadRequestException('Cannot start verification, try again.');
    }
  }

  timestamp() {
    return new Date().toISOString();
  }

  async getDecision(
    userId: Types.ObjectId,
  ): Promise<{ kycUrl: string; decisionVerification: any }> {
    const kyc: Kyc = await this.kycModel.findOne({
      userId: userId,
    });

    if (!kyc) {
      throw new NotFoundException('KYC does not exist.');
    }

    const xHmacSignature = this.generateSignature(
      kyc.sessionId,
      process.env.VERIFF_API_PRIVATE_KEY,
    );

    const headers = {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': process.env.VERIFF_API_PUBLIC_KEY,
      'X-HMAC-SIGNATURE': xHmacSignature,
    };

    const options = {
      headers,
    };

    try {
      const decision = await this.client<DecisionResponse>(
        'get',
        `sessions/${kyc.sessionId}/decision`,
        options,
      );

      return { kycUrl: kyc.url, decisionVerification: decision.verification };
    } catch (ex) {
      throw new BadRequestException('Cannot get verification decision.');
    }
  }
}
