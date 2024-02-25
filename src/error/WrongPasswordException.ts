import { statusCode } from "../constant/StatusCode";
export class WrongPasswordException extends Error {
  static message: string = "wrong password";
  static statusCode = statusCode.clientError.unothorized;
  constructor() {
    super();
  }
}
