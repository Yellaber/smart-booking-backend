import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty({
        example: 'Main branch',
        description: 'The name of the branch. It must have 50 characters maximum.',
        format: 'string',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    name: string = '';

    @ApiProperty({
        example: 'Cra 8 # 14-25',
        description: 'Address of the branch. It must have 50 characters maximum.',
        format: 'string'
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    address: string = '';

    @ApiProperty({
        example: 'CO',
        description: 'ISO code of the country where the branch is located.',
        format: 'string'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(2)
    alpha2CodeCountry: string = '';

    @ApiProperty({
        example: 'cartagena',
        description: 'City where the branch is located. It must have 30 characters maximum.',
        format: 'string',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    city: string = '';

    @ApiProperty({
        example: '1234567890',
        description: 'Phone number of the branch. It must have 10 characters maximum.',
        format: 'string',
        required: false
    })
    @IsString()
    @MinLength(1)
    @MaxLength(10)
    @IsOptional()
    phone?: string;

    @ApiProperty({
        example: 'branchname@gmail.com',
        description: 'Email address of the branch. It must have 40 characters maximum.',
        format: 'string',
        required: false
    })
    @IsEmail()
    @MaxLength(40)
    @IsOptional()
    email?: string;
}
