import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { KycModule } from '../kyc/kyc.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    KycModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
