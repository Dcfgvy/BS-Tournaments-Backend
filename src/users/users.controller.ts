import { Body, Controller, Get, HttpException, HttpStatus, Ip, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { RegisterFormDto } from './dtos/RegisterForm.dto';
import { AuthService } from './services/auth/auth.service';
import { UserInterceptor } from './interceptors/user.interceptor';
import { LoginFormDto } from './dtos/LoginForm.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiPaymentRequiredResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { TokenResponseDto } from './dtos/TokenResponse.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../typeorm/entities/User.entity';
import { ApiPagination } from '../services/pagination/api-pagination.decorator';
import { AdminGuard } from './guards/admin.guard';
import { UsersService } from './services/users/users.service';
import { PaginationParams } from '../services/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { BanUserDto } from './dtos/BanUser.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ){}
  @Post('/register')
  @UseInterceptors(UserInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with this tag already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid trophy change' })
  register(@Body() registerDto: RegisterFormDto, @Ip() ip: string) {
    return this.authService.register(registerDto, ip);
  }

  @Post('/login')
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  login(@Body() loginFormDto: LoginFormDto){
    return this.authService.login(loginFormDto);
  }

  @Post('/refresh')
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid refresh token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.updateToken(refreshTokenDto);
  }

  @Get('/info')
  // not using @UseGuards(AuthGuard) because a banned user won't be able to get information about their ban
  @UseInterceptors(UserInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  getUserInfo(@GetUser() user: User){
    if(!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return user;
  }

  @Get('/all')
  @UseGuards(AdminGuard)
  @UseInterceptors(UserInterceptor)
  @ApiBearerAuth()
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiPagination()
  @ApiOkResponse({ type: [UserResponseDto] })
  getAllUsers(
    @Query('tag') tag: string,
    @PaginationParams() paginationParams: IPaginationOptions
  ){
    return this.usersService.fetchAllUsers(paginationParams, tag);
  }

  @Put('/ban/:id')
  @UseGuards(AdminGuard)
  @UseInterceptors(UserInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  banUser(
    @Body() banUserDto: BanUserDto,
    @Param('id', ParseIntPipe) id: number,
  ){
    let date: Date = null;
    if(banUserDto.bannedUntil && new Date(banUserDto.bannedUntil).getTime()){
      date = new Date(banUserDto.bannedUntil);
    }
    return this.usersService.banUser(id, date);
  }

  @Put('/unban/:id')
  @UseGuards(AdminGuard)
  @UseInterceptors(UserInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  unbanUser(
    @Param('id', ParseIntPipe) id: number,
  ){
    return this.usersService.unbanUser(id);
  }

  @Post('/become-organizer')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiConflictResponse({ description: 'Already an organizer' })
  @ApiPaymentRequiredResponse({ description: 'Not enough funds' })
  becomeOrganizer(
    @GetUser() user: User,
  ){
    return this.usersService.becomeOrganizer(user.id);
  }
}
