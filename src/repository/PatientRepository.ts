import busboy from "busboy";
import { LoginCredential_Interface } from "../type/generic/LoginCredential_Interface";
import { EMR_Interface } from "../type/patient/EMR_Interface";
import { Patient_Interface } from "../type/patient/Patient_Interface";
import { IncomingHttpHeaders } from "http";
import { Patient } from "../dto/Patient";
export interface PatientRepository {
  signup(patient: Patient): Promise<Patient>;

  //   login(credential: LoginCredential_Interface): Promise<Patient_Interface>;

  //   getEMR(id: number): Promise<EMR_Interface>;

  //   getAll(): Promise<Patient_Interface>;

  //   addSurgery(
  //     surgeryName: String,
  //     //  name: String,
  //     //  file: internal.Readable,
  //     //  info: busboy.FileInfo,
  //     headers: IncomingHttpHeaders
  //   ): Promise<busboy.Busboy>;
}
