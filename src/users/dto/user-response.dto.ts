import { ApiProperty } from '@nestjs/swagger';
import { IdType, UserRole } from '../../common/enums';

export class UserResponseDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Unique identifier for the user in UUID format.',
        uniqueItems: true,
        format: 'uuid'
    })
    id: string = '';

    @ApiProperty({
        example: 'CC',
        description: 'Type of identification document. It must be a valid IdType enum value.',
        enum: IdType,
        format: 'string'
    })
    idType: IdType = IdType.CEDULA_CIUDADANIA;
    
    @ApiProperty({
        example: '1234567890',
        description: 'Identification number of the profile owner.',
        format: 'string'
    })
    idNumber: string = '';
    
    @ApiProperty({
        example: 'john doe',
        description: 'Full name of the profile owner.',
        format: 'string'
    })
    fullName: string = '';
    
    @ApiProperty({
        example: 'john-doe',
        description: 'Unique username chosen by the user.',
        uniqueItems: true,
        format: 'string'
    })
    userName: string = '';

    @ApiProperty({
        example: '123 Main St, Springfield',
        description: 'Address of the profile owner.',
        format: 'string',
        nullable: true
    })
    address?: string;
            
    @ApiProperty({
        example: 'johndoe@gmail.com',
        description: 'Email address of the profile owner.',
        format: 'string',
    })
    email: string = '';
            
    @ApiProperty({
        example: '1234567890',
        description: 'Phone number of the profile owner.',
        format: 'string',
        required: false
    })
    phone?: string;
        
    @ApiProperty({
        example: 'cartagena',
        description: 'City where the profile owner resides.',
        format: 'string',
        required: false
    })
    city?: string;
        
    @ApiProperty({
        example: 'https://example.com/images/profile.jpg',
        description: 'URL of the profile image.',
        format: 'string',
        required: false
    })
    image?: string;
    
    @ApiProperty({
        example: [ 'customer', 'specialist' ],
        description: 'Roles assigned to the user.',
        enum: UserRole,
        isArray: true,
        default: [ 'customer' ]
    })
    roles: UserRole[] = [];
}