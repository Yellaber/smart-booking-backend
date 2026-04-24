import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { AppointmentStatus } from '../../common/enums';
import { Service } from '../../services/entities/service.entity';
import { Specialist } from '../../specialists/entities/specialist.entity';
import { User } from '../../users/entities/user.entity';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    date: string;
    
    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.CONFIRMED })
    status: AppointmentStatus;

    @ManyToOne(() => Branch, (branch) => branch.bookings)
    branch: Branch;

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;

    @ManyToOne(() => Specialist, (specialist) => specialist.bookings)
    specialist: Specialist;

    @ManyToMany(() => Service)
    @JoinTable({ name: 'booking_services' })
    services: Service[];
}
