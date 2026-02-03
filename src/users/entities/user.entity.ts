import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { IdType } from 'src/common/enums';

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

    @Column({ type: 'enum', enum: UserRole, array: true, default: [UserRole.CUSTOMER] })
    roles: UserRole[];

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Company, (company) => company.users)
    company: Company;

    @BeforeInsert()
    @BeforeUpdate()
    checkFieldsBeforeInsert() {
        this.fullName = this.fullName.toLowerCase();
        this.userName = this.userName.toLowerCase();
        this.email = this.email.toLowerCase();

        if(this.city)
            this.city = this.city.toLowerCase();
    }
}
