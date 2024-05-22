export class Patient {
  public patient_id: number | null;
  public FirstName: string | null;
  public LastName: string | null;
  public Email: string | null;
  public Password: string | null;
  public Gender: string | null;
  public DOB: string | null;
  public accessToken: string | null;

  constructor(json: any) {
    this.patient_id = json.patient_id || null;
    this.FirstName = json.FirstName || null;
    this.LastName = json.LastName || null;
    this.Email = json.Email || null;
    this.Password = json.Password || null;
    this.Gender = json.Gender || null;
    this.DOB = json.DOB || null;
    this.accessToken = json.accessToken || null;
  }

  public toJson() {
    return {
      FirstName: this.FirstName,
      LastName: this.LastName,
      Email: this.Email,
      Password: this.Password,
      Gender: this.Gender,
      DOB: this.DOB,
      accessToken: this.accessToken,
    };
  }
}
