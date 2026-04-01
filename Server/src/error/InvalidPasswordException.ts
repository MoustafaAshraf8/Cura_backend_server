import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class InvalidPasswordException
  extends Error
  implements Exception_Interface
{
  message: string = "invalid password";
  statusCode = statusCode.clientError.badRequest;
  constructor() {
    super();
  }
}
