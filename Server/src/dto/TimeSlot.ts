export class TimeSlot {
  public timeslot_id: number;
  public schedule_id: number | null;
  public patient_id: number | null;
  public Start: string | null;
  public End: string | null;

  constructor(json: any) {
    this.timeslot_id = json.timeslot_id;
    this.schedule_id = json.schedule_id || null;
    this.patient_id = json.patient_id || null;
    this.Start = json.Start || null;
    this.End = json.End || null;
  }

  public toJson() {
    return {
      timeslot_id: this.timeslot_id,
      schedule_id: this.schedule_id,
      patient_id: this.patient_id,
      Start: this.Start,
      End: this.End,
    };
  }
}
