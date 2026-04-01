import { DoctorDTO } from "../dto/DoctorDTO";
import { User } from "../dto/User";
import db from "../model";
import { DoctorRepository } from "./DoctorRepository";
import { Repository } from "./Repository";

export class DoctorRepositoryImplementation
  extends Repository
  implements DoctorRepository
{
  constructor() {
    super(db.Patient);
  }
}
