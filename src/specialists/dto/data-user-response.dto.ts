import { ApiProperty } from '@nestjs/swagger';

export class DataUserResponseDto {
    @ApiProperty({
        example:'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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