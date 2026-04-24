import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { ScheduleException } from '../../schedule-exceptions/entities/schedule-exception.entity';
import { Service } from '../../services/entities/service.entity';
import { User } from '../../users/entities/user.entity';

@Entity('specialists')
@Unique('UQ_branch_user', ['branch', 'user'])
export class Specialist {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column('boolean', { default: true })
    isActive: boolean = true;
    
    @ManyToOne(() => Branch, (branch) => branch.specialists)
    branch: Branch = {} as Branch;

    @OneToOne(() => User)
    @JoinColumn()
    user: User = {} as User;

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
