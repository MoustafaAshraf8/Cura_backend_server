import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class InvalidDataTypeException
  extends Error
  implements Exception_Interface
{
  message: string = "invalid data type";
  statusCode = statusCode.clientError.badRequest;
  constructor() {
    super();
  }
}
