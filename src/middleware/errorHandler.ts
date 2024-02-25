import { Request, Response, NextFunction } from "express";
import { Exception_Interface } from "../type/Exception/Exception_Interface";
import { statusCode } from "../constant/StatusCode";

function errorHandler(
  exception: Exception_Interface,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.statusCode =
    exception.statusCode || statusCode.serverError.internalServerError;
  res.json({
    name: exception.name,
    msg: exception.message,
    stack: exception.stack,
  });
}

export { errorHandler };
