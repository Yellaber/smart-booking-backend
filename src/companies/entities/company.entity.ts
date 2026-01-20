import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'companies' })
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', { unique: true })
    idNumber: string;

    @Column('text', { unique: true })
    name: string;

    @Column('text', { unique: true })
    slug: string;

    @Column('text', { nullable: true })
    webSite: string;

    @Column('text', { nullable: true })
    logo: string;

    @Column('text', { default: 'active' })
    status: string;

    @Column('timestamp')
    createdAt: Date;

    @Column('timestamp')
    updatedAt: Date;

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

    @BeforeInsert()
    checkCreateAt() {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    checkUpdateAt() {
        this.updatedAt = new Date();
    }
}
