import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class InvalidEmailException
  extends Error
  implements Exception_Interface
{
  message: string = "invalid email";
  statusCode = statusCode.clientError.badRequest;
  constructor() {
    super();
  }
}
