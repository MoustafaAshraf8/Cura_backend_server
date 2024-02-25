import { statusCode } from "../constant/StatusCode";
export class UserNotFoundException extends Error {
  static message: string = "user not found";
  static statusCode = statusCode.clientError.notFound;
  constructor() {
    super();
  }
}
