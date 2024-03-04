import { statusCode } from "../../constant/StatusCode";
export class ScheduleNotFoundException extends Error {
  static message: string = "schedule not found";
  static statusCode = statusCode.clientError.notFound;
  constructor() {
    super();
  }
}
