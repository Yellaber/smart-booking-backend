import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'companies' })
export class Company {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string = '';
    
    @Column('text', { unique: true })
    idNumber: string = '';

    @Column('text', { unique: true })
    name: string = '';

    @Column('text', { unique: true })
    slug: string = '';

    @Column('text', { nullable: true })
    webSite: string = '';

    @Column('text', { nullable: true })
    logo: string = '';

    @Column('boolean', { default: true })
    isActive: boolean = true;

    @OneToMany(() => Branch, (branch) => branch.company)
    branches: Branch[];

    @OneToMany(() => User, (user) => user.company)
    users: User[];

    @ManyToMany(() => SubCategory)
    @JoinTable({ name: 'company_subcategories' })
    subCategories: SubCategory[];

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
    }
}
