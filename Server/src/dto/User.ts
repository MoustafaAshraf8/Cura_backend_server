export class User {
  public Email: string;
  public Password: string;

  constructor(json: any) {
    this.Email = json.Email;
    this.Password = json.Password;
  }

  public toJson() {
    return {
      Email: this.Email,
      Password: this.Password,
    };
  }
}
