import { Body, Controller, Post, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterFormDto } from './dtos/RegisterForm.dto';
import { AuthService } from './auth.service';
import { UserInterceptor } from './interceptors/user.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  @Post('/register')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(new UserInterceptor())
  register(@Body() registerDto: RegisterFormDto){
    return this.authService.register(registerDto);
  }
}
