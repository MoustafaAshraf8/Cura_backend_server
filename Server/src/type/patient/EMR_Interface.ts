import { Desease_Interface } from "./Desease_Interface";
import { Surgery_Interface } from "./Surgery_Interface";
export interface EMR_Interface {
  emr_id: number;
  patient_id: number;
  desease: [Desease_Interface];
  surgery: [Surgery_Interface];
}
