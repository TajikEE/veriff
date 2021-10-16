import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@veriff.3kwkj.mongodb.net/test`,
    ),
    UsersModule,
    AuthModule,
    KycModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
