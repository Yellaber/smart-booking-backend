import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RegisterUserDto } from './register-user.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @ApiProperty({
        example: [ UserRole.CUSTOMER, UserRole.SPECIALIST ],
        description: 'Roles assigned to the user.',
        enum: UserRole,
        required: false,
        isArray: true
    })
    @IsEnum(UserRole, { each: true })
    @IsOptional()
    roles?: UserRole[];
}
