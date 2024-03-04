export interface TimeSlot_Interface {
  timeslot_id: number;
  clinic_id: number;
  schedule_id: number;
  patient_id: number | null;
  Date: Date;
  Available: boolean;
}
