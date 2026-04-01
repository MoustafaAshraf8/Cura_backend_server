import { PatientPhoneNumber_Interface } from "./PatientPhoneNumber_Interface";
import { EMR_Interface } from "./EMR_Interface";
export interface Patient_Interface {
  patient_id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Gender: string | null;
  DOB: string | null;
  EMR: EMR_Interface;
  patientphonenumber: [PatientPhoneNumber_Interface];
  accessToken: string;
}
