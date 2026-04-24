import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column('text', { unique: true })
    code: string = '';

    @Column('text')
    name: string = '';

    @Column('text', { unique: true })
    alpha3Code: string = '';

    @Column('text', { unique: true })
    alpha2Code: string = '';

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.name = this.name.toLowerCase();
    }
}
