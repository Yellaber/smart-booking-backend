import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Specialist } from '../../specialists/entities/specialist.entity';
import { TypeScheduleException } from '../interfaces/type-schedule-exception.enum';

@Entity('schedule_exceptions')
export class ScheduleException {    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    date: string;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @Column({ type: 'enum', enum: TypeScheduleException })
    type: TypeScheduleException;

    @Column('text')
    reason: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Specialist, (specialist) => specialist.scheduleExceptions)
    specialist: Specialist;

    @BeforeInsert()
    prepareNameBeforeSave() {
        this.reason = this.reason.toLowerCase().trim();
    }
}
