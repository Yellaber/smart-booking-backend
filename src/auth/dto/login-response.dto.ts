import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        example: 'john-doe',
        description: 'Unique username chosen by the user.',
        format: 'string'
    })
    userName: string = '';

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT token for authenticating the user.',
        format: 'string'
    })
    token: string = '';
}