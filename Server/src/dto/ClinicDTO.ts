export class ClinicDTO {
  public clinic_id: number | null;
  public Fee: string | null;

  constructor(json: any) {
    this.clinic_id = json.clinic_id || null;
    this.Fee = json.Fee || null;
  }
}
