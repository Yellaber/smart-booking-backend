import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AppointmentStatus } from 'src/common/enums';

const allowedStatuses = [ AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELED, AppointmentStatus.COMPLETED ];

@Injectable()
export class ParseBookingStatusPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if(!allowedStatuses.includes(value as AppointmentStatus))
      throw new BadRequestException(`Invalid booking status: ${ value }`);

    return value;
  }
}
