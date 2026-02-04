import { CreateCompanyDto } from 'src/companies/dto';
import { UserSetupDto } from './user-setup.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class InitSetupDto {
    @ApiProperty({
        example: {
            idNumber: '1234567890',
            name: 'Company name',
            webSite: 'https://example.com',
            logo: 'https://example.com/images/logo.png'
        },
        description: 'Information about the company.',
        type: CreateCompanyDto
    })
    @ValidateNested()
    @Type(() => CreateCompanyDto)
    @IsNotEmpty()
    company: CreateCompanyDto;

    @ApiProperty({
        example: {
            idType: 'CC',
            idNumber: '1234567890',
            fullName: 'John Doe',
            userName: 'johndoe',
            password: 'Password1!',
            address: 'Cra 8 # 14-25',
            email: 'johndoe@gmail.com',
            phone: '1234567890',
            city: 'Cartagena',
            image: 'https://example.com/images/profile.jpg',
            roles: [ UserRole.SUPER_USER ]
        },
        description: 'Information about the user.',
        type: UserSetupDto
    })
    @ValidateNested()
    @Type(() => UserSetupDto)
    @IsNotEmpty()
    user: UserSetupDto
}
