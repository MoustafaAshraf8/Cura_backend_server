import { Patient } from "../class/Patient";
import { User } from "../class/User";

export interface PatientDAO {
  signup(patient: Patient): Promise<Patient>;
  signin(user: User): Promise<Patient>;
  authorize(patient_id: number): Promise<void>;
}
