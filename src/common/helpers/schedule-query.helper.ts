import { User } from 'src/users/entities/user.entity';
import { UserRole } from '../enums';

export interface ScheduleQuery {
  id?: string;
  specialist: { id: string };
  isActive?: boolean;
}

export class ScheduleQuery {
  static get(specialistId: string, authenticatedUser: User, scheduleId?: string) {
    let query: ScheduleQuery = { specialist: { id: specialistId } };
        
    if(scheduleId)
      query = { id: scheduleId, ...query };
    
    return (authenticatedUser.roles.includes(UserRole.ADMIN) || authenticatedUser.roles.includes(UserRole.SUPER_USER))?
      query: { ...query, isActive: true }
  }
}
