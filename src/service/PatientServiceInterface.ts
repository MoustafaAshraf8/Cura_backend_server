import { Patient } from "../class/Patient";
import { User } from "../class/User";

export interface PatientServiceInterface {
  signin(user: User): Promise<Patient>;
  signup(patient: Patient): Promise<Patient>;
}
