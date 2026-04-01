import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class TimeSlotNotFoundException
  extends Error
  implements Exception_Interface
{
  message: string = "time slot not found";
  statusCode = statusCode.clientError.notFound;
  constructor() {
    super();
  }
}
