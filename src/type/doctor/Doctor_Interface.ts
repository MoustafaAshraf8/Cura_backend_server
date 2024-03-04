import { Speciality_Interface } from "./Speciality_Interface";

export interface Doctor_Interface {
  doctor_id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Gender: string;
  DOB: string | null;
  speciality_id: number;
  speciality: Speciality_Interface;
}
