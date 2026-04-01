import { ApiProperty } from '@nestjs/swagger';

export class SetupResponseDto {
    @ApiProperty({
        example: 'Setup completed successfully',
        description: 'Message indicating the result of the setup process',
        format: 'string'
    })
    message: string;

    @ApiProperty({
        example: true,
        description: 'Indicates if the setup was successful',
        format: 'boolean'
    })
    success: boolean;
}