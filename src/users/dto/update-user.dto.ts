import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @ApiProperty({
        example: [UserRole.CUSTOMER, UserRole.SPECIALIST],
        description: 'Roles assigned to the user.',
        enum: UserRole,
        isArray: true
    })
    @IsEnum(UserRole, { each: true })
    @IsOptional()
    roles?: UserRole[];

    @ApiProperty({
        example: true,
        description: 'Indicates whether the user account is active or not.',
        format: 'boolean'
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
