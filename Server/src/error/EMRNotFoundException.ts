import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class EMRNotFoundException extends Error implements Exception_Interface {
  message: string = "emr not found";
  statusCode = statusCode.clientError.notFound;
  constructor() {
    super();
  }
}
