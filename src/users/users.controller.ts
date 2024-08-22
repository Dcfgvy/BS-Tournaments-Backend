import { Body, Controller, Get, Ip, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterFormDto } from './dtos/RegisterForm.dto';
import { AuthService } from './services/auth/auth.service';
import { UserInterceptor } from './interceptors/user.interceptor';
import { LoginFormDto } from './dtos/LoginForm.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';
import { UsersService } from './services/users/users.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ){}
  @Post('/register')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new UserInterceptor())
  register(@Body() registerDto: RegisterFormDto, @Ip() ip: string){
    return this.authService.register(registerDto, ip);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginFormDto: LoginFormDto){
    return this.authService.login(loginFormDto);
  }

  @Post('/refresh')
  @UsePipes(new ValidationPipe())
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.updateToken(refreshTokenDto);
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  @UseInterceptors(new UserInterceptor())
  getUserInfo(@Req() req: Request){
    return this.usersService.getUserInfo(req['user']);
  }
}
