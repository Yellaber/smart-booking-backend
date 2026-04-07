import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('countries')
@Unique('UQ_COUNTRY_ALPHA_CODE', [ 'alpha3Code', 'alpha2Code' ])
export class Country {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    code: string;

    @Column('text')
    name: string;

    @Column('text')
    alpha3Code: string;

    @Column('text')
    alpha2Code: string;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.name = this.name.toLowerCase();
    }
}
