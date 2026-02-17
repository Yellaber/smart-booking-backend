import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Specialist } from 'src/specialists/entities/specialist.entity';
import { DayOfWeek } from '../interfaces/day-of-week.enum';

@Entity('schedules')
@Unique('UQ_schedule_specialist', ['specialist', 'dayOfWeek', 'startTime', 'endTime'])
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: DayOfWeek })
    dayOfWeek: DayOfWeek;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Specialist, (specialist) => specialist.schedules)
    specialist: Specialist;
}
