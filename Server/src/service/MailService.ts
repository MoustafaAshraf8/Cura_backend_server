import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";
dotenv.config();
export class MailService {
  private static transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  static {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gamil.com",
      port: 465,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  }

  static async SignUpPatientCongrats(email: String) {
    try {
      const mailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [email],
        subject: "Cura sign up",
        text: "hello world",
        html: "<h1>thank you for signing up at Cura for Patients</h1>",
      };

      await this.transport.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  static async SignUpDoctorCongrats(email: String) {
    try {
      const mailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [email],
        subject: "Cura sign up",
        text: "hello world",
        html: "<h1>thank you for signing up at Cura for Doctors</h1>",
      };

      await this.transport.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}
