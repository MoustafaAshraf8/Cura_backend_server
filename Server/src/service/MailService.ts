import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export class MailService {
  static async sendMail(email: String) {
    try {
      const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gamil.com",
        port: 465,
        secure: false,
        auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [email],
        subject: "Cura sign up",
        text: "hello world",
        html: "<h1>thank you for signing up at Cura</h1>",
      };

      await transport.sendMail(mailOptions);
      console.log("mail sent successfully ✔");
    } catch (err) {
      console.log(err);
    }
  }
}
