import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';

@Entity('services')
@Unique('UQ_branch_name', ['branch', 'name'])
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column('text')
    name: string = '';

    @Column('int')
    durationMinutes: number = 0;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number = 0;
    
    @Column('boolean', { default: true })
    isActive: boolean = true;

    @ManyToOne(() => Branch, (branch) => branch.services)
    branch: Branch = {} as Branch;

    @BeforeInsert()
    @BeforeUpdate()
    prepareNameBeforeSave() {
        if(this.name) this.name = this.name.toLowerCase().trim();
    }
}
