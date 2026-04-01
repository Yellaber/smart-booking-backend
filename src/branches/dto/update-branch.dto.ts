import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
    @ApiProperty({
        example: true,
        description: 'Indicates whether the branch is active or not.',
        format: 'boolean',
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
