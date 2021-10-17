import { Injectable } from '@nestjs/common';
import { CreateSessionResponse } from './dto/create-session-response.dto';
import { createServiceClient } from '../utils/client/got.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import crypto from 'crypto';
import { User } from '../users/interfaces/user.interface';
import { KycVerificationDto } from './dto/kyc-verification.dto';
import { Kyc } from './interfaces/kyc.interface';
import { DecisionResponse } from './dto/decision-response.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Kyc') private readonly kycModel: Model<Kyc>,
  ) {}

  client = createServiceClient('https://stationapi.veriff.com/v1/');

  generateSignature(payload, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(Buffer.from(payload, 'utf8'))
      .digest('hex')
      .toLowerCase();
  }

  async startVerification(kycVerificationDto: KycVerificationDto) {
    const user = await this.userModel.findOne({
      _id: kycVerificationDto.userId,
      verified: true,
    });

    const body = {
      verification: {
        // redirect to my own domain
        callback: 'https://asd.com/netlify/login',
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

    console.log(res);
    console.log({ kyc });
  }

  timestamp() {
    return new Date().toISOString();
  }

  async getDecision(userId) {
    const kyc: Kyc = await this.kycModel.findOne({
      userId: userId,
    });

    const xHmacSignature = this.generateSignature(
      kyc.sessionId,
      process.env.VERIFF_API_PRIVATE_KEY,
    );

    console.log(xHmacSignature);

    const headers = {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': process.env.VERIFF_API_PUBLIC_KEY,
      'X-HMAC-SIGNATURE': xHmacSignature,
    };

    const options = {
      headers,
    };

    const decision = await this.client<DecisionResponse>(
      'get',
      `sessions/${kyc.sessionId}/decision`,
      options,
    );

    return { kycUrl: kyc.url, decision: decision.verification };
  }
}
