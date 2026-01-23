import { IsEmail, IsEnum, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IdType } from 'src/common/enums/id-type.enum';

export class CreateProfileDto {
    @IsEnum(IdType)
    @MinLength(1)
    @MaxLength(3)
    idType: IdType;
    
    @IsNumberString()
    @MinLength(1)
    @MaxLength(12)
    idNumber: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    fullName: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    @IsOptional()
    address?: string;
    
    @IsEmail()
    @MaxLength(40)
    @IsOptional()
    email?: string;
    
    @IsNumberString()
    @MinLength(1)
    @MaxLength(10)
    @IsOptional()
    phone?: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @IsOptional()
    city?: string;
    
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @IsOptional()
    image?: string;
}
