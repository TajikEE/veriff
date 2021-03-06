import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Types } from 'mongoose';

jest.mock('./users.service');

import { Test, TestingModule } from '@nestjs/testing';

describe('Users controller', () => {
  let usersService: UsersService;
  let module: TestingModule;
  let usersController: UsersController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersController = module.get(UsersController);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      name: 'asd',
      email: 'asd@asd.com',
      password: 'password123',
    };
    jest.spyOn(usersService, 'create').mockResolvedValue({
      success: true,
      data: {
        verification: '2592a105-d0d3-4593-a11d-06cef1a76ac',
      },
    });
    expect(await usersController.register(createUserDto)).toEqual({
      success: true,
      data: {
        verification: '2592a105-d0d3-4593-a11d-06cef1a76ac',
      },
    });
  });

  it('should verify email', async () => {
    const VerifyUserDto = {
      verification: '5fec8ab5-f883-4e39-850f-2c0afffd1b12',
    };

    const apiResponse = {
      success: true,
      data: { userId: '626a73c4f88bcae2304ab00a', verified: true },
    };

    jest.spyOn(usersService, 'verifyEmail').mockResolvedValue(apiResponse);
    expect(await usersController.verifyEmail(VerifyUserDto)).toBe(apiResponse);
  });
});
