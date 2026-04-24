import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        example: 'john-doe',
        description: 'Unique username chosen by the user. It must start with a letter, can contain letters, digits, and hyphens (-), and be between 5 and 10 characters long.',
        format: 'string'
    })
    @IsString()
    @Matches(/^[A-Za-z][A-Za-z0-9-]{4,9}$/,
        { message: 'userName must start with a letter, can contain letters, digits, and hyphens (-), and be between 5 and 10 characters long.' }
    )
    userName: string = '';

    @ApiProperty({
        example: 'Password1!',
        description: 'Password for the user account. It must start with an uppercase letter, contain lowercase letters, digits, at least one special character, and be at least 8 characters long.',
        format: 'string'
    })
    @IsString()
    @Matches(/^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
        { message: 'password must start with an uppercase letter, contain lowercase letters, digits, at least one special character, and be at least 8 characters long.' }
    )
    password: string = '';
}