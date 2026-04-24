import { AppointmentStatus } from '../../common/enums'

export interface BookingQuery {
  id?: string,
  branch?: {
    id: string
  },
  user?: {
    id: string
  },
  specialist?: {
    id: string
  },
  status?: AppointmentStatus
}