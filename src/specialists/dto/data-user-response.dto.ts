import { ApiProperty } from '@nestjs/swagger';

export class DataUserResponseDto {
    @ApiProperty({
        example:'t1g2c3d4-e5f6-7g8h-9i0j-k3l2x3n4o5p6',
        description: 'User id.',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: 'john doe',
        description: 'User full name.'
    })
    fullName: string;

    @ApiProperty({
        example: 'https://www.company.com/users/john-doe.png',
        description: 'User image.',
        nullable: true
    })
    image: string;
}