import { IsArray, IsEmail, IsEnum, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdType, UserRole } from 'src/common/enums';

export class UserSetupDto {
    @ApiProperty({
        example: 'CC',
        description: 'Type of identification document. It must be a valid IdType enum value. It must have 3 characters maximum.',
        enum: IdType,
        format: 'string'
    })
    @IsEnum(IdType)
    @MinLength(1)
    @MaxLength(3)
    idType: IdType;
    
    @ApiProperty({
        example: '1234567890',
        description: 'Identification number of the profile owner. It must have 12 characters maximum.',
        format: 'string'
    })
    @IsNumberString()
    @MinLength(1)
    @MaxLength(12)
    idNumber: string;
    
    @ApiProperty({
        example: 'John doe',
        description: 'Full name of the profile owner. It must have 30 characters maximum.',
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
        description: 'Address of the profile owner. It must have 50 characters maximum.',
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
        description: 'Email address of the profile owner. It must have 40 characters maximum.',
        format: 'string',
        required: false
    })
    @IsEmail()
    @MaxLength(40)
    email: string;
            
    @ApiProperty({
        example: '1234567890',
        description: 'Phone number of the profile owner. It must have 10 characters maximum.',
        format: 'string',
        required: false
    })
    @IsNumberString()
    @MinLength(1)
    @MaxLength(10)
    @IsOptional()
    phone?: string;
        
    @ApiProperty({
        example: 'Cartagena',
        description: 'City where the profile owner resides. It must have 20 characters maximum.',
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
        description: 'URL of the profile image. It must have 40 characters maximum.',
        format: 'string',
        required: false
    })
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @IsOptional()
    image?: string;
    
    @ApiProperty({
        example: [ UserRole.SUPER_USER ],
        description: 'Roles assigned to the user.',
        enum: UserRole,
        isArray: true,
        default: [ UserRole.SUPER_USER ]
    })
    @IsArray({ each: true })
    @IsOptional()
    roles?: UserRole[];
}