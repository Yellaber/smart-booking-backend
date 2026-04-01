export interface ScheduleQuery {
  id?: string;
  specialist: { id: string };
  isActive?: boolean;
}

export class ScheduleQuery {
  static get(specialistId: string, scheduleId?: string) {
    let query: ScheduleQuery = { specialist: { id: specialistId }, isActive: true };
        
    if(scheduleId)
      query = { id: scheduleId, ...query };
    
    return query;
  }
}
