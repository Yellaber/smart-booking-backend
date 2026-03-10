import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({
        example: 'Haircut',
        description: 'Name of the service.',
        format: 'string'
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    name: string;

    @ApiProperty({
        example: 30,
        description: 'Duration of the service in minutes.',
        format: 'number'
    })
    @IsNumber()
    @Min(1)
    durationMinutes: number;

    @ApiProperty({
        example: 21000,
        description: 'Price of the service.',
        format: 'number'
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(1)
    price: number;
}
