import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { User } from './interfaces/user.interface';
import { KycService } from '../kyc/kyc.service';
import { ApiResponse, apiResponse } from '../utils/api-response';
@Injectable()
export class UsersService {
  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;
  MIN_AGE_LIMIT = 18;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly kycService: KycService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse> {
    const user = new this.userModel(createUserDto);
    await this.isEmailUnique(user.email);
    this.setVerificationInfo(user);
    await user.save();

    return apiResponse(true);
  }

  async verifyEmail(verifyUserDto: VerifyUserDto) {
    const user = await this.findByVerification(verifyUserDto.verification);
    await this.setUserAsVerified(user);

    return apiResponse(true, { userId: user._id, verified: user.verified });
  }

  async login(req: Request, loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);
    this.isUserBlocked(user);

    if (user.verifiedAge === false) {
      const { kycUrl, decision } = await this.kycService.getDecision(user._id);

      if (decision === null) {
        return apiResponse(false, kycUrl, 'Verification pending');
      }

      if (decision.person?.dateOfBirth >= this.MIN_AGE_LIMIT) {
        user.verifiedAge = true;
        user.save();
      }
    }

    await this.checkPassword(loginUserDto.password, user);
    await this.passwordsAreMatch(user);

    return apiResponse(true, {
      name: user.name,
      email: user.email,
      accessToken: await this.authService.createAccessToken(
        user._id.toString(),
      ),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    });
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken,
    );
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Bad request');
    }

    return apiResponse(true, {
      accessToken: await this.authService.createAccessToken(
        user._id.toString(),
      ),
    });
  }

  // private methods
  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email, verified: true });
    if (user) {
      throw new BadRequestException('Email most be unique.');
    }
  }

  private setVerificationInfo(user): any {
    user.verification = v4();
    user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
  }

  private async findByVerification(verification: string): Promise<User> {
    const user = await this.userModel.findOne({
      verification,
      verified: false,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new BadRequestException('Bad request.');
    }
    return user;
  }

  private async setUserAsVerified(user) {
    user.verified = true;
    await user.save();
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, verified: true });
    if (!user) {
      throw new NotFoundException('Wrong email or password.');
    }
    return user;
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
      await this.passwordsDoNotMatch(user);
      throw new NotFoundException('Wrong email or password.');
    }
    return match;
  }

  private isUserBlocked(user) {
    if (user.blockExpires > Date.now()) {
      throw new ConflictException('User has been blocked, try later.');
    }
  }

  private async passwordsDoNotMatch(user) {
    user.loginAttempts += 1;
    await user.save();
    if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
      await this.blockUser(user);
      throw new ConflictException('User blocked.');
    }
  }

  private async blockUser(user) {
    user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
    await user.save();
  }

  private async passwordsAreMatch(user) {
    user.loginAttempts = 0;
    await user.save();
  }
}
