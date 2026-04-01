import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/users/dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { Auth } from './decorators/auth.decorator';
import { LoginResponseDto, LoginUserDto, RegisterResponseDto } from './dto';

@Controller('companies/:companySlug/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  register(
    @Param('companySlug') companySlug: string,
    @Body() registerUserDto: RegisterUserDto
  ) {
    return this.authService.register(companySlug, registerUserDto);
  }

  @Post('login')
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Credentials are not valid.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  login(
    @Param('companySlug') companySlug: string,
    @Body() loginUserDto: LoginUserDto
  ) {
    return this.authService.login(companySlug, loginUserDto);
  }

  @Get('refresh')
  @Auth()
  @ApiParam({ name: 'companySlug', description: 'Company slug.' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token related.' })
  @ApiResponse({ status: 404, description: 'Not found. Company not found.' })
  refresh(
    @Param('companySlug') companySlug: string,
    @GetUser() authenticatedUser: User
  ) {
    return this.authService.refresh(companySlug, authenticatedUser);
  }
}
