import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto';

export class RegisterResponseDto {
    @ApiProperty({
        type: () => UserResponseDto,
        description: 'User registered successfully.'
    })
    user: UserResponseDto;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT token for authenticating the user.',
        format: 'string'
    })
    token: string;
}