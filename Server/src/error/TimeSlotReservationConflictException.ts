import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class TimeSlotReservationConflictException
  extends Error
  implements Exception_Interface
{
  message: string = "TimeSlot Reservation Conflict Exception";
  statusCode = statusCode.clientError.conflict;
  constructor() {
    super();
  }
}
