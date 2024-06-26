import { statusCode } from "../../constant/StatusCode";
import { Exception_Interface } from "../../type/exception/Exception_Interface";
export class ClinicNotFoundException
  extends Error
  implements Exception_Interface
{
  message: string = "clinic not found";
  statusCode = statusCode.clientError.notFound;
  constructor() {
    super();
  }
}
