import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Specialist } from 'src/specialists/entities/specialist.entity';
import { TypeScheduleException } from '../interfaces/type-schedule-exception.enum';

@Entity('schedule_exceptions')
export class ScheduleException {    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    date: string;

    @Column('time', { nullable: true })
    startTime: string;

    @Column('time', { nullable: true })
    endTime: string;

    @Column({ type: 'enum', enum: TypeScheduleException })
    type: TypeScheduleException;

    @Column('text', { nullable: true })
    reason: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Specialist, (specialist) => specialist.scheduleExceptions)
    specialist: Specialist;
}
