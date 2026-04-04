export interface ScheduleQuery {
  id?: string;
  specialist: { id: string };
  isActive?: boolean;
}