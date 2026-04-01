import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class WrongPasswordException
  extends Error
  implements Exception_Interface
{
  message: string = "wrong password";
  statusCode = statusCode.clientError.unothorized;
  constructor() {
    super();
  }
}
