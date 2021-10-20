import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { KycService } from '../kyc/kyc.service';
import { Types } from 'mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let kycService: KycService;

  const user = {
    _id: '6164680035249fb93e8feef0',
    name: 'Tip View',
    email: 'tip-view-60@inboxkitten.com',
    password: '$2b$10$RiiEFxNvs3lfug5ezZ6T9.T.1Yg0imJwThcgi1Tt4N/F/BOq3jJXW',
    verified: true,
    loginAttempts: 0,
    verificationExpires: '2021-10-11T20:36:16.634Z',
    blockExpires: '2021-10-11T16:36:16.601Z',
    verification: '88b03233-a3cc-4196-aac6-6e0c7bbc0109',
    createdAt: '2021-10-11T16:36:16.635Z',
    updatedAt: '2021-10-11T16:40:40.928Z',
    __v: 0,

    save: () => {
      return true;
    },
  };

  const refreshToken = {
    _id: new Types.ObjectId('607397e09f43069d7a34f609'),
    refreshToken: 'asdasdasd123',
  };

  const kyc = {
    _id: new Types.ObjectId('607397e09f43069d7a34f609'),
    status: 'success',
    verification: {},
  };
  class UserModel {
    async save() {
      return user;
    }
    async findOne() {
      return user;
    }
  }
  class RefreshTokenModel {
    async save() {
      return refreshToken;
    }
  }
  class KycModel {
    async save() {
      return kyc;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        KycService,
        {
          provide: AuthService,
          useValue: {
            registerUserAsync: jest.fn(), // <--here
          }
         },
        { provide: getModelToken('User'), useValue: new UserModel() },
        { provide: getModelToken('RefreshToken'), useValue: RefreshTokenModel },
        { provide: getModelToken('Kyc'), useValue: KycModel },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    kycService = module.get<KycService>(KycService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should spy onasdasd email', async () => {
    const VerifyUserDto = {
      verification: '5fec8ab5-f883-4e39-850f-2c0afffd1b12',
    };

    const apiResponse = {
      success: true,
      data: { userId: '6164680035249fb93e8feef0', verified: true },
    };
    const findByVerification = jest.spyOn(usersService, 'findByVerification');
    // jest.spyOn(UserModel, 'findOne').mockReturnValue(Promise.resolve(user));
    expect(await usersService.verifyEmail(VerifyUserDto)).toEqual(apiResponse);

    expect(findByVerification).toHaveBeenCalledTimes(1);
  });
});
