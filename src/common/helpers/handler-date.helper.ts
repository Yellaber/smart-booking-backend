import { Service } from 'src/services/entities/service.entity';
import { DayOfWeek } from 'src/schedules/interfaces/day-of-week.enum';

export class HandlerDate {
    static calculateEndTime(startTime: string, services: Service[]) {
        const totalDuration = services.reduce((total, service) => total + service.durationMinutes, 0);
        const [ hours, minutes ] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + totalDuration;
        const endTimeHours = Math.floor(totalMinutes / 60);
        const endTimeMinutes = totalMinutes % 60;
        return `${ String(endTimeHours).padStart(2, '0') }:${ String(endTimeMinutes).padStart(2, '0') }`;
    }
    
    static getDayOfWeek(date: string) {
        const daysOfWeek = Object.values(DayOfWeek);
        const [ year, month, day ] = date.split('-').map(Number);
        const numberDayOfWeek = new Date(year, month - 1, day).getDay();
        return daysOfWeek[ numberDayOfWeek ];
    }

    static transformTimeToSecond(hourString: string) {
        const hourArray = hourString.split(':').map(Number);
        return hourArray[0] * 3600 + hourArray[1] * 60;
    }

    static getCurrentDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear());
        return `${ year }-${ month }-${ day }`;
    }
}