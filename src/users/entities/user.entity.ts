import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { IdType } from '../../common/enums';
import { Company } from '../../companies/entities/company.entity';

@Entity({ name: 'users' })
@Unique('UQ_company_idNumber', [ 'company', 'idNumber' ])
@Unique('UQ_company_userName', [ 'company', 'userName' ])
@Unique('UQ_company_email', [ 'company', 'email' ])
export class User {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column({ type: 'enum', enum: IdType })
    idType: IdType;

    @Column('text')
    idNumber: string;

    @Column('text')
    fullName: string;

    @Column('text')
    userName: string;

    @Column('text')
    password: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('text')
    email: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text', { nullable: true })
    city: string;

    @Column('text', { nullable: true })
    image: string;

    @Column({ type: 'enum', enum: UserRole, array: true, default: [ UserRole.CUSTOMER ] })
    roles: UserRole[];

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Company, (company) => company.users)
    company: Company;

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];

    @BeforeInsert()
    @BeforeUpdate()
    checkFieldsBeforeInsert() {
        if(this.fullName)
            this.fullName = this.fullName.toLowerCase();

        if(this.userName)
            this.userName = this.userName.toLowerCase();

        if(this.address)
            this.address = this.address.toLowerCase();

        if(this.email)
            this.email = this.email.toLowerCase();

        if(this.city)
            this.city = this.city.toLowerCase();
    }
}
