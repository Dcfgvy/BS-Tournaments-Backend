import { Body, Controller, Get, HttpStatus, Ip, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterFormDto } from './dtos/RegisterForm.dto';
import { AuthService } from './services/auth/auth.service';
import { UserInterceptor } from './interceptors/user.interceptor';
import { LoginFormDto } from './dtos/LoginForm.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';
import { UsersService } from './services/users/users.service';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { TokenResponseDto } from './dtos/TokenResponse.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ){}
  @Post('/register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(UserInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with this tag already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid trophy change' })
  register(@Body() registerDto: RegisterFormDto, @Ip() ip: string) {
    return this.authService.register(registerDto, ip);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  login(@Body() loginFormDto: LoginFormDto){
    return this.authService.login(loginFormDto);
  }

  @Post('/refresh')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid refresh token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.updateToken(refreshTokenDto);
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(UserInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  getUserInfo(@Req() req: Request){
    return this.usersService.getUserInfo(req['user']);
  }
}
