import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class InvalidDateException extends Error implements Exception_Interface {
  message: string = "invalid date";
  statusCode = statusCode.clientError.badRequest;
  constructor() {
    super();
  }
}
