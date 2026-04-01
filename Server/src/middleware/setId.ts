import { Request, Response, NextFunction } from "express";

// fake middleware to add id to request object
// id will be added from jwt in real situation
export function setId(req: Request, res: Response, next: NextFunction) {
  Object(req).id = 1;
  next();
}
