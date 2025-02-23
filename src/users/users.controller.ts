import { Body, Controller, Delete, Get, HttpException, HttpStatus, Ip, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { RegisterFormDto } from './dtos/RegisterForm.dto';
import { AuthService } from './services/auth/auth.service';
import { UserInterceptor } from './interceptors/user.interceptor';
import { LoginFormDto } from './dtos/LoginForm.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBadGatewayResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiPaymentRequiredResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { TokenResponseDto } from './dtos/TokenResponse.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../database/entities/User.entity';
import { ApiPagination } from '../other/pagination/api-pagination.decorator';
import { AdminGuard } from './guards/admin.guard';
import { UsersService } from './services/users/users.service';
import { PaginationParams } from '../other/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { BanUserDto } from './dtos/BanUser.dto';
import { TagUpperCasePipe } from './pipes/tag-uppercase.pipe';
import { TgLoginFormDto } from './dtos/TgLoginForm.dto';
import { TgConnectionLinkResponseDto } from './dtos/TgConnectionLinkResponse.dto';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';
import { UpdateUserRolesDto } from './dtos/UpdateUserRoles.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ){}

  @Post('/register')
  @UsePipes(TagUpperCasePipe)
  @UseInterceptors(UserInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with this tag already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid trophy change' })
  register(@Body() registerDto: RegisterFormDto, @Ip() ip: string) {
    return this.authService.register(registerDto, ip);
  }

  @Post('/login')
  @UsePipes(TagUpperCasePipe)
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  login(@Body() loginFormDto: LoginFormDto){
    return this.authService.login(loginFormDto);
  }

  @Post('/login/telegram')
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  loginViaTelegram(@Body() loginFormDto: TgLoginFormDto){
    return this.authService.loginViaTelegram(loginFormDto);
  }

  @Put('/change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto){
    return this.authService.changePassword(user, changePasswordDto);
  }

  @Post('/refresh')
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid refresh token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.updateToken(refreshTokenDto);
  }

  @Get('/me')
  // not using @UseGuards(AuthGuard) because a banned user won't be able to get information about their ban
  @UseInterceptors(UserInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  getUserInfo(@GetUser() user: User){
    if(!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return user;
  }

  @Post('/telegram/connect')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: TgConnectionLinkResponseDto })
  async connectTelegramAccount(@GetUser() user: User){
    const link = await this.authService.generateTelegramAccountConnectionLink(user);
    return { link };
  }

  @Delete('/telegram/unlink')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  unlinkTelegramAccount(@GetUser() user: User){
    return this.authService.unlinkTelegramAccount(user);
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

  @Put('/user-roles/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadGatewayResponse({ description: 'Invalid roles' })
  updateUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ){
    return this.usersService.updateUserRoles(id, updateUserRolesDto.roles);
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
