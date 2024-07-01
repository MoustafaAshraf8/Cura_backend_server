export class DoctorDTO {
  public doctor_id: Number | null;
  public FirstName: String | null;
  public LastName: String | null;
  public Email: String | null;
  public Password: String | null;
  public Gender: String | null;
  public DOB: String | null;

  public Rating: Number | null;
  public Experience: String | null;
  public speciality_id: Number | null;
  public Approved: Boolean;
  public Image: String | null;

  public accessToken: string | null;

  constructor(json: any) {
    this.doctor_id = json.doctor_id || null;
    this.FirstName = json.FirstName || null;
    this.LastName = json.LastName || null;
    this.Email = json.Email || null;
    this.Password = json.Password || null;
    this.Gender = json.Gender || null;
    this.DOB = json.DOB || null;
    this.Rating = json.Rating || null;
    this.Experience = json.Experience || null;
    this.speciality_id = json.speciality_id || null;
    this.Approved = json.Approved || null;
    this.Image = json.Image || null;
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

  public getSignUpObj() {
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
