import { statusCode } from "../constant/StatusCode";
export class InvalidTokenException extends Error {
  static message: string = "invalid token";
  static statusCode = statusCode.clientError.unothorized;
  constructor() {
    super();
  }
}
