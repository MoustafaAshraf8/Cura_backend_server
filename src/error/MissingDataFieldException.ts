import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class MissingDataFieldException
  extends Error
  implements Exception_Interface
{
  message: string = "missing data field";
  statusCode = statusCode.clientError.badRequest;
  constructor() {
    super();
  }
}
