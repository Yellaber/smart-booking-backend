import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('specialists')
@Unique('UQ_branch_user', ['branch', 'user'])
export class Specialist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('boolean', { default: true })
    isActive: boolean;
    
    @ManyToOne(() => Branch, (branch) => branch.specialists)
    branch: Branch;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(() => Schedule, (schedule) => schedule.specialist)
    schedules: Schedule[];
}
