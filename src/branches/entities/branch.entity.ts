import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Specialist } from 'src/specialists/entities/specialist.entity';

@Entity({ name: 'branches' })
@Unique('UQ_company_branch_name', [ 'company', 'name' ])
export class Branch {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    slug: string;

    @Column('text')
    address: string;

    @Column('text')
    city: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text', { nullable: true })
    email: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Company, (company) => company.branches)
    company: Company;

    @OneToMany(() => Specialist, (specialist) => specialist.branch)
    specialists: Specialist[];

    @BeforeInsert()
    @BeforeUpdate()
    prepareDataBeforeSave() {
        if(this.name) {
            this.name = this.name.toLowerCase().trim();
            this.slug = this.name.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        if(this.address)
            this.address = this.address.toLowerCase().trim();

        if(this.city)
            this.city = this.city.toLowerCase().trim();

        if(this.email)
            this.email = this.email.toLowerCase().trim();
    }
}
