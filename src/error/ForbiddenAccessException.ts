import { statusCode } from "../constant/StatusCode";
export class ForbiddenAccessException extends Error {
  static message: string = "forbidden access";
  static statusCode = statusCode.clientError.forbidden;
  constructor() {
    super();
  }
}
