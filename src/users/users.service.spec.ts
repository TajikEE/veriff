import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { KycService } from '../kyc/kyc.service';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let kycService: KycService;

  const createUserDoc = {
    _id: new Types.ObjectId('607397e09f43069d7a34f609'),
    name: 'asd',
    email: 'asd@asd.com',
    password: 'asdasdasd123',
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
      return createUserDoc;
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
        AuthService,
        KycService,
        { provide: getModelToken('User'), useValue: UserModel },
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
});
