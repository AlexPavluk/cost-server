import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-jwt.dto';
import { LoginGuard } from './guard/login.guard';
import { RefreshJwtGuard } from './guard/refresh-iwt.guard';
import { RegisrationGuard } from './guard/registracion.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.userService.login(loginUserDto);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
    const access = await this.authService.generateAccessToken(user);
    const refresh = await this.authService.generateRefreshToken(
      user._id as string,
    );

    res.statusCode = HttpStatus.OK;
    return res.send({
      ...access,
      ...refresh,
      username: user.username,
    });
  }

  @UseGuards(RegisrationGuard)
  @Post('registracion')
  async registracionUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.userService.registacion(createUserDto);

    res.statusCode = HttpStatus.CREATED;
    return res.send('user cteated');
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const validToken = this.authService.verifyToken(
      refreshTokenDto.refresh_token,
    );
    const user = await this.userService.findOne(refreshTokenDto.username);

    const access = await this.authService.generateAccessToken(user);

    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        const refresh = await this.authService.generateRefreshToken(
          user._id as string,
        );

        res.statusCode = HttpStatus.OK;
        return res.send({ ...access, ...refresh });
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST;
        return res.send({ error: validToken?.error });
      }
    } else {
      res.statusCode = HttpStatus.OK;
      return res.send({
        ...access,
        refresh_token: refreshTokenDto.refresh_token,
      });
    }
  }
}
