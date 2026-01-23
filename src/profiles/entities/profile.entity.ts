import { Entity } from 'typeorm';
import { Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm'

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    idType: string;

    @Column('text', { unique: true })
    idNumber: string;

    @Column('text')
    fullName: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('text', { nullable: true })
    email: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text', { nullable: true })
    city: string;

    @Column('text', { nullable: true })
    image: string;

    @Column('timestamp')
    createdAt: Date;

    @Column('timestamp')
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    prepareDataBeforeSave() {
        if(this.fullName)
            this.fullName = this.fullName.toLowerCase().trim();

        if(this.address)
            this.address = this.address.toLowerCase().trim();

        if(this.email)
            this.email = this.email.toLowerCase().trim();

        if(this.city)
            this.city = this.city.toLowerCase().trim();
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
