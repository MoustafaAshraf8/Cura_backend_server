import { PatientPhoneNumber_Interface } from "./PatientPhoneNumber_Interface";
import { EMR_Interfce } from "./EMR_Interface";
export interface Patient_Interface {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Gender: string | null;
  DOB: string | null;
  EMR: EMR_Interfce;
  PhoneNumber: [PatientPhoneNumber_Interface];
}
