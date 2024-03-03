import { Prescription_Interface } from "./Prescription_Interface";

export interface Desease_Interface {
  desease_id: number;
  emr_id: number;
  Diagnose: string;
  Note: string;
  prescription: [Prescription_Interface];
}
