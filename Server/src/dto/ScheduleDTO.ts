import { TimeSlot } from "./TimeSlot";

export class ScheduleDTO {
  public schedule_id: number | null;
  public clinic_id: number | null;
  public Day: string | null;
  public Date: string | null;
  public timeslot: [TimeSlot] | [];

  constructor(json: any) {
    this.schedule_id = json.schedule_id || null;
    this.clinic_id = json.clinic_id || null;
    this.Day = json.Day || null;
    this.Date = json.Date || null;
    this.timeslot =
      json.hasOwnProperty("timeslot") && Array.isArray(json.timeslot)
        ? json.timeslot.map((slot: any) => new TimeSlot(slot))
        : [];
  }

  public toJson() {
    return {
      schedule_id: this.schedule_id,
      clinic_id: this.clinic_id,
      Day: this.Day,
      Date: this.Date,
      timeslot: this.timeslot.map((slot) => slot.toJson),
    };
  }

  public createObj() {
    return {
      // schedule_id: this.schedule_id,
      // clinic_id: this.clinic_id,
      Day: this.Day,
      Date: this.Date,
    };
  }
}
