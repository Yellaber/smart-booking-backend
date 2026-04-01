import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AppointmentStatus } from 'src/common/enums';

const allowedStatuses = Object.values(AppointmentStatus);

@Injectable()
export class ParseBookingStatusPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const status = value.toLowerCase() as AppointmentStatus;

    if(!allowedStatuses.includes(status))
      throw new BadRequestException(`Invalid booking status: "${ value }". Allowed values are: ${ allowedStatuses.join(', ') }`);

    return status;
  }
}
