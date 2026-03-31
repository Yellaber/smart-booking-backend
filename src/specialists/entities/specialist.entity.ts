import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { ScheduleException } from 'src/schedule-exceptions/entities/schedule-exception.entity';
import { Service } from 'src/services/entities/service.entity';
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

    @OneToMany(() => ScheduleException, (scheduleException) => scheduleException.specialist)
    scheduleExceptions: ScheduleException[];

    @OneToMany(() => Booking, (booking) => booking.specialist)
    bookings: Booking[];

    @ManyToMany(() => Service)
    @JoinTable({ name: 'specialist_services' })
    services: Service[];
}
