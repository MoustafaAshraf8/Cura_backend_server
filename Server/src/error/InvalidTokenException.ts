import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class InvalidTokenException
  extends Error
  implements Exception_Interface
{
  message: string = "invalid token";
  statusCode = statusCode.clientError.unothorized;
  constructor() {
    super();
  }
}
