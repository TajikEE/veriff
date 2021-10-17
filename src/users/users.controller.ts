import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UsersService } from './users.service';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('verify-email/:verification')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param() verifyUuidDto: VerifyUserDto) {
    return await this.userService.verifyEmail(verifyUuidDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(req, loginUserDto);
  }

  @Post('refresh-access-token')
  @HttpCode(HttpStatus.CREATED)
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }
}
