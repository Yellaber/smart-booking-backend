import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IdType } from 'src/common/enums';

export class RegisterUserDto {
    @ApiProperty({
        example: 'CC',
        description: 'Type of identification document of the user. It must be a valid IdType enum value. It must have 3 characters maximum.',
        enum: IdType,
        format: 'string'
    })
    @IsEnum(IdType)
    @MinLength(1)
    @MaxLength(3)
    idType: IdType;

    @ApiProperty({
        example: '1234567890',
        description: 'Identification number of the user. It must have 12 characters maximum.',
        format: 'string'
    })
    @IsNumberString()
    @MinLength(1)
    @MaxLength(12)
    idNumber: string;

    @ApiProperty({
        example: 'john doe',
        description: 'Full name of the user account. It must have 30 characters maximum.',
        format: 'string'
    })
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    fullName: string;

    @ApiProperty({
        example: 'john-doe',
        description: 'Unique username chosen by the user. It must start with a letter, can contain letters, digits, and hyphens (-), and be between 5 and 10 characters long.',
        format: 'string'
    })
    @IsString()
    @Matches(/^[A-Za-z][A-Za-z0-9-]{4,9}$/,
        { message: 'userName must start with a letter, can contain letters, digits, and hyphens (-), and be between 5 and 10 characters long.' }
    )
    userName: string;

    @ApiProperty({
        example: 'Password1!',
        description: 'Password for the user account. It must start with an uppercase letter, contain lowercase letters, digits, at least one special character, and be at least 8 characters long.',
        format: 'string'
    })
    @IsString()
    @Matches(/^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
        { message: 'password must start with an uppercase letter, contain lowercase letters, digits, at least one special character, and be at least 8 characters long.' }
    )
    password: string;

    @ApiProperty({
        example: 'Cra 8 # 14-25',
        description: 'Address of the user account. It must have 50 characters maximum.',
        format: 'string',
        required: false
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @IsOptional()
    address?: string;
        
    @ApiProperty({
        example: 'johndoe@gmail.com',
        description: 'Email address of the user account. It must have 40 characters maximum.',
        format: 'string',
        required: false
    })
    @IsEmail()
    @MaxLength(40)
    email: string;
        
    @ApiProperty({
        example: '1234567890',
        description: 'Phone number of the user account. It must have 10 characters maximum.',
        format: 'string',
        required: false
    })
    @IsNumberString()
    @MinLength(1)
    @MaxLength(10)
    @IsOptional()
    phone?: string;
    
    @ApiProperty({
        example: 'cartagena',
        description: 'City where the user resides. It must have 20 characters maximum.',
        format: 'string',
        required: false
    })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @IsOptional()
    city?: string;
    
    @ApiProperty({
        example: 'https://example.com/images/profile.jpg',
        description: 'URL of the user account image. It must have 40 characters maximum.',
        format: 'string',
        required: false
    })
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @IsOptional()
    image?: string;
}
