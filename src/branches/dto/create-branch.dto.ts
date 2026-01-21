import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateBranchDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(50)
    address: string;

    @IsString()
    @MinLength(1)
    @MaxLength(30)
    city: string;

    @IsEmail()
    @MaxLength(40)
    @IsOptional()
    email?: string;

    @IsUUID()
    companyId: string;
}
