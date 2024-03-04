export interface Schedule_Interface {
  schedule_id: number;
  clinic_id: number;
  Day: Enumerator<[1, 2, 3, 4, 5, 6, 7]>;
  Start: string;
  End: string;
}
