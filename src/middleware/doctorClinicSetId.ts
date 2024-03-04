import { Request, Response, NextFunction } from "express";

// fake middleware to add id to request object
// id will be added from jwt in real situation
export function doctorClinicSetId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  Object(req).doctor_id = 2;
  Object(req).clinic_id = 1;
  next();
}
