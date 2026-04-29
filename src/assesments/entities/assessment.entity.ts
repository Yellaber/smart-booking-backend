import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';

@Entity('assessments')
export class Assessment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric', { precision: 2, scale: 1 })
    rating: number;

    @Column('text', { nullable: true })
    comment: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Branch, (branch) => branch.assessments)
    branch: Branch;

    @ManyToOne(() => User, (user) => user.assessments)
    user: User;

    @BeforeInsert()
    @BeforeUpdate()
    checkCommentBeforeInsertAndUpdate() {
        if(this.comment)
            this.comment = this.comment.toLowerCase().trim();
    }
}
