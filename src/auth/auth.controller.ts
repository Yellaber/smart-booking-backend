import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/users/dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from './decorators';
import { Auth } from './decorators/auth.decorator';
import { LoginResponseDto, LoginUserDto, RegisterResponseDto } from './dto';
import { AuthService } from './auth.service';

@Controller('companies/:companySlug/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiParam({ name: 'companySlug', description: 'Company slug to register user.' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  register(@Param('companySlug') companySlug: string, @Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(companySlug, registerUserDto);
  }

  @Post('login')
  @ApiParam({ name: 'companySlug', description: 'Company slug to login user.' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Credentials are not valid.' })
  login(@Param('companySlug') companySlug: string, @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(companySlug, loginUserDto);
  }

  @Get('refresh')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Company slug to refresh token current user.' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  refresh(@Param('companySlug') companySlug: string, @GetUser() user: User) {
    return this.authService.refresh(companySlug, user);
  }
}
