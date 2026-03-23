import { statusCode } from "../constant/StatusCode";
import { Exception_Interface } from "../type/exception/Exception_Interface";
export class DatabaseConnectionError
  extends Error
  implements Exception_Interface
{
  message: string = "Database not initialized";
  statusCode = statusCode.serverError.internalServerError;
  constructor() {
    super();
  }
}
