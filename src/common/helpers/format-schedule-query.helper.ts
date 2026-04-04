import { ScheduleQuery } from '../interfaces/schedule-query.interface';

export class FormatScheduleQuery {
  static get(specialistId: string, scheduleId?: string) {
    let query: ScheduleQuery = { specialist: { id: specialistId }, isActive: true };
        
    if(scheduleId)
      query = { id: scheduleId, ...query };
    
    return query;
  }
}
