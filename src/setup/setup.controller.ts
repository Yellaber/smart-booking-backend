import { Controller, Post, Body } from '@nestjs/common';
import { SetupService } from './setup.service';
import { ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/users/dto';
import { SetupResponseDto } from './dto/setup-response.dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Indicate if the setup has been completed successfully or already was.', type: SetupResponseDto })
  bootstraping(@Body() registerUserDto: RegisterUserDto) {
    return this.setupService.bootstraping(registerUserDto);
  }
}
