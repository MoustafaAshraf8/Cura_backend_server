import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { INTEGER } from "sequelize";
export class MessageHandler {
  private static transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  static {
    this.transport = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  }

  static async SignUpPatientCongrats(parameters: {
    firstName: string;
    email: String;
  }) {
    const { firstName, email } = { ...parameters };
    try {
      const mailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [email],
        subject: "Cura sign up",
        text: "Cura sign up",
        html: "<h1>Thank you for signing up at Cura for Patients</h1>",
      };

      await this.transport.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  static async SignUpDoctorCongrats(parameters: {
    firstName: string;
    email: String;
  }) {
    const { firstName, email } = { ...parameters };
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

  static async patientReservedTimeSlot(parameters: {
    doctorFirstName: string;
    doctorEmail: String;
    patientFirstName: string;
    patientEmail: String;
  }) {
    const { doctorFirstName, patientFirstName, doctorEmail, patientEmail } = {
      ...parameters,
    };
    try {
      const doctorMailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [doctorEmail],
        subject: "Time slot update",
        text: "Time slot update",
        html: `
               <p>
                  <h1>Hello ${doctorFirstName},</h1>
               </p>
               <p>
                  <h4>
                     ${patientFirstName} just reserved one of your time slots, get into the app to see the updates
                  </h4>
               </p>`,
      };

      const patientMailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [doctorEmail],
        subject: "Reservation update",
        text: "Reservation update",
        html: `
               <p>
                  <h1>Hello ${patientFirstName},</h1>
               </p>
               <p>
                  <h4>
                     your reservation was succeed, get into the app to see the updates
                  </h4>
               </p>`,
      };

      await this.transport.sendMail(doctorMailOptions);
      await this.transport.sendMail(patientMailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  static async patientCancelledTimeSlot(parameters: {
    doctorFirstName: string;
    doctorEmail: String;
    patientFirstName: string;
    patientEmail: String;
  }) {
    const { doctorFirstName, patientFirstName, doctorEmail, patientEmail } = {
      ...parameters,
    };
    try {
      const doctorMailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [doctorEmail],
        subject: "Time slot update",
        text: "Time slot update",
        html: `
               <p>
                  <h1>Hello ${doctorFirstName},</h1>
               </p>
               <p>
                  <h4>
                     ${patientFirstName} just cancelled one of your time slots, get into the app to see the updates
                  </h4>
               </p>`,
      };

      const patientMailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [doctorEmail],
        subject: "Reservation update",
        text: "Reservation update",
        html: `
               <p>
                  <h1>Hello ${patientFirstName},</h1>
               </p>
               <p>
                  <h4>
                     your cancellation was succeed, get into the app to see the updates
                  </h4>
               </p>`,
      };

      await this.transport.sendMail(doctorMailOptions);
      await this.transport.sendMail(patientMailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  static async doctorCancelledTimeSlot(parameters: {
    doctorFirstName: string;
    doctorEmail: String;
    patientFirstName: string;
    patientEmail: String;
  }) {
    const { doctorFirstName, patientFirstName, doctorEmail, patientEmail } = {
      ...parameters,
    };
    try {
      const doctorMailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [doctorEmail],
        subject: "Time slot update",
        text: "Time slot update",
        html: `
               <p>
                  <h1>Hello ${doctorFirstName},</h1>
               </p>
               <p>
                  <h4>
                     your cancellation was succeed, get into the app to see the updates
                  </h4>
               </p>`,
      };

      const patientMailOptions: any = {
        from: {
          name: "Cura",
          address: process.env.USER,
        },
        to: [doctorEmail],
        subject: "Reservation update",
        text: "Reservation update",
        html: `
               <p>
                  <h1>Hello ${patientFirstName},</h1>
               </p>
               <p>
                  <h4>
                     your reservation for Dr/ ${doctorFirstName} appointement was cancelled by him, get into the app to see the updates
                  </h4>
               </p>`,
      };

      await this.transport.sendMail(doctorMailOptions);
      await this.transport.sendMail(patientMailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  static async handle(parameters: {
    operation: string;
    data: any;
    correlationId: string;
    replyToQueue: string;
  }) {
    let response: any;
    const { operation, data, correlationId, replyToQueue } = { ...parameters };
    switch (operation) {
      case "patient-signup":
        this.SignUpPatientCongrats({
          firstName: data.patientFirstName,
          email: data.patientEmail,
        });
      case "doctor-signup":
        this.SignUpDoctorCongrats({
          firstName: data.doctorFirstName,
          email: data.doctorEmail,
        });
      case "patient-reserved":
        this.patientReservedTimeSlot({
          doctorEmail: data.doctorEmail,
          doctorFirstName: data.doctorFirstName,
          patientEmail: data.patientEmail,
          patientFirstName: data.patientFirstName,
        });
      case "patient-cancelled":
        this.patientCancelledTimeSlot({
          doctorEmail: data.doctorEmail,
          doctorFirstName: data.doctorFirstName,
          patientEmail: data.patientEmail,
          patientFirstName: data.patientFirstName,
        });
      case "doctor-cancelled":
        this.doctorCancelledTimeSlot({
          doctorEmail: data.doctorEmail,
          doctorFirstName: data.doctorFirstName,
          patientEmail: data.patientEmail,
          patientFirstName: data.patientFirstName,
        });
    }
  }
}
