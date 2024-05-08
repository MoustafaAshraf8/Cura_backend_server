export class Patient {
  public patient_id: number | null;
  public FirstName: string;
  public LastName: string;
  public Email: string;
  public Password: string | null;
  public Gender: string;
  public DOB: string;
  public accessToken: string | null;

  constructor(json: any) {
    this.patient_id = json.patient_id || null;
    this.FirstName = json.FirstName;
    this.LastName = json.LastName;
    this.Email = json.Email;
    this.Password = json.Password;
    this.Gender = json.Gender;
    this.DOB = json.DOB;
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
