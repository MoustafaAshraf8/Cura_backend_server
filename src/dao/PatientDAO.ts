import { Patient } from "../dto/Patient";
import { User } from "../dto/User";

export interface PatientDAO {
  signup(patient: Patient): Promise<Patient>;
  signin(user: User): Promise<Patient>;
  authorize(patient_id: number): Promise<void>;
}
