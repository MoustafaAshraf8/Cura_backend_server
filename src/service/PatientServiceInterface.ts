import { ClinicDTO } from "../dto/ClinicDTO";
import { Patient } from "../dto/Patient";
import { User } from "../dto/User";

export interface PatientServiceInterface {
  signin(user: User): Promise<Patient>;
  signup(patient: Patient): Promise<Patient>;
  payOnline(clinicDTO: ClinicDTO, patient_id: number): Promise<string>;
}
