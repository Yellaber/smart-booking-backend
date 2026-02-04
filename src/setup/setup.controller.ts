import { Controller, Post, Body } from '@nestjs/common';
import { SetupService } from './setup.service';
import { ApiResponse } from '@nestjs/swagger';
import { InitSetupDto, SetupResponseDto } from './dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Indicate if the setup has been completed successfully or already was.', type: SetupResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  bootstraping(@Body() initSetupDto: InitSetupDto) {
    return this.setupService.bootstraping(initSetupDto);
  }
}
