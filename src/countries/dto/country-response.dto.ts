import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
    @ApiProperty({
        example: '840',
        description: 'The ISO 3166-1 numeric code of the country',
        format: 'string'
    })
    code: string = '';

    @ApiProperty({
        example: 'colombia',
        description: 'The name of the country',
        format: 'string'
    })
    name: string = '';

    @ApiProperty({
        example: 'COL',
        description: 'The ISO 3166-1 alpha-3 code of the country',
        format: 'string'
    })
    alpha3Code: string = '';

    @ApiProperty({
        example: 'CO',
        description: 'The ISO 3166-1 alpha-2 code of the country',
        format: 'string'
    })
    alpha2Code: string = '';
}