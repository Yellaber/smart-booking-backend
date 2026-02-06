import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';

@Entity({ name: 'specialties' })
@Unique('UQ_company_name_specialty', [ 'company', 'name' ])
export class Specialty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @ManyToOne(() => Company, (company) => company.specialties)
    company: Company;

    @Column('boolean', { default: true })
    isActive: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    prepareDataBeforeSave() {
        if(this.name)
            this.name = this.name.toLowerCase().trim();

        if(this.description)
            this.description = this.description.toLowerCase().trim();
    }
}
