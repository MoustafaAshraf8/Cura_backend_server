import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class UnothorizedUserException
  extends Error
  implements Exception_Interface
{
  message: string = "unothorized user";
  statusCode = statusCode.clientError.unothorized;
  constructor() {
    super();
  }
}
