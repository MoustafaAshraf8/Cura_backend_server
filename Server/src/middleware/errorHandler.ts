import { Request, Response, NextFunction } from "express";
import { Exception_Interface } from "../type/exception/Exception_Interface";
import { statusCode } from "../constant/StatusCode";

function errorHandler(
  exception: Exception_Interface,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(`global error handler: ${exception}`);
  res.statusCode =
    exception.statusCode || statusCode.serverError.internalServerError;
  res.json({
    name: exception.name,
    msg: exception.message,
    stack: exception.stack,
  });
}

export { errorHandler };
