import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto';

export class RegisterResponseDto {
    @ApiProperty({
        example: {
            id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
            idType: 'CC',
            idNumber: '1234567890',
            fullName: 'john doe',
            userName: 'john-doe',
            address: 'Cra 8 # 14-25',
            email: 'johndoe@gmail.com',
            phone: '1234567890',
            city: 'cartagena',
            image: 'https://example.com/images/profile.jpg',
            roles: [ 'customer', 'specialist' ]
        },
        type: UserResponseDto,
        description: 'User registered successfully.'
    })
    user: UserResponseDto = {} as UserResponseDto;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT token for authenticating the user.',
        format: 'string'
    })
    token: string = '';
}