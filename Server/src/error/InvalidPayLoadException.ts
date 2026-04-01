import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class InvalidPayLoadException
  extends Error
  implements Exception_Interface
{
  message: string = "invalid payload";
  statusCode = statusCode.clientError.badRequest;
  constructor() {
    super();
  }
}
