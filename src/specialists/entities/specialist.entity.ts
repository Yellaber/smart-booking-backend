import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('specialists')
@Unique('UQ_branch_user', ['branch', 'user'])
export class Specialist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Branch, (branch) => branch.specialists)
    branch: Branch;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column('boolean', { default: true })
    isAvailable: boolean;
}
