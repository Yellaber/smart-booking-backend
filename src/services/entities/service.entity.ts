import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';

@Entity('services')
@Unique('UQ_branch_name', ['branch', 'name'])
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('int')
    durationMinutes;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
    
    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Branch, (branch) => branch.services)
    branch: Branch;

    @BeforeInsert()
    @BeforeUpdate()
    prepareNameBeforeSave() {
        if(this.name) this.name = this.name.toLowerCase().trim();
    }
}
