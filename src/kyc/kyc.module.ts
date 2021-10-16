import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { KycSchema } from './schemas/kyc.schema';
import { KycController } from './kyc.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Kyc', schema: KycSchema },
    ]),
  ],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
