import { Request, Response, NextFunction } from "express";
export interface PatientControllerInterface {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  signin(req: Request, res: Response, next: NextFunction): Promise<void>;
  reserveTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  deleteReservedTimeSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  payOnline(req: Request, res: Response, next: NextFunction): Promise<void>;
  getSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  addAllergy(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllAllergy(req: Request, res: Response, next: NextFunction): Promise<void>;
  addChronicIllness(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getAllChronicIllness(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getAllergyFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getChronicIllnessFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
