import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { KycModule } from 'src/kyc/kyc.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    KycModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
