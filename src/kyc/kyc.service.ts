import { Injectable } from '@nestjs/common';
import { CreateSessionResponse, Verification } from './dto/veriff';
import { createServiceClient } from 'src/utils/client/got.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import crypto from 'crypto';
import { User } from 'src/users/interfaces/user.interface';
import { KycVerificationDto } from './dto/kyc-verification.dto';
import { Kyc } from './interfaces/kyc.interface';

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
    // Flow
    // First we signup with email and password
    // User will verify email
    // Kyc inputs for verification (validate the inputs)
    // User goes to veriff url
    // User does whatever verification inside veriff
    // Veriff uses callback url to send user back to our app
    // Now we check decision for login (pass is login to wallet, fail is 401 error)

    // save session id, and session token, status

    // create update balance for user

    // 2 routes for wallet: 
    //  1 is to check balance, getRoute 1 param: userId, network, accessToken
    //  2 is to import wallet from some external api, postRoute, body: accessToken, exchange
    const user = await this.userModel.findOne({
      _id: kycVerificationDto.userId,
      verified: true,
    });

    console.log(kycVerificationDto);

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

    const decision = await this.client<CreateSessionResponse>(
      'get',
      `sessions/${kyc.sessionId}/decision`,
      options,
    );
    console.log({decision})
    return decision.verification;
  }
}
