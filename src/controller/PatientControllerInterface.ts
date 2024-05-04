import { Request, Response, NextFunction } from "express";
export interface PatientControllerInterface {
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEMR(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  addSurgery(req: Request, res: Response, next: NextFunction): Promise<void>;
}
