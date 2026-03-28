import mongoose from "mongoose";

interface IPrescription {
  name: String;
  dose: number;
  frequency: number;
  createdAt: Date;
  updateddAt: Date;
}

export interface IPrescriptionModel extends IPrescription, mongoose.Document {}

export const prescriptionSchema: mongoose.Schema<IPrescriptionModel> =
  new mongoose.Schema<IPrescriptionModel>({
    _id: {
      type: mongoose.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      require: true,
    },
    dose: {
      type: Number,
      require: true,
    },
    frequency: {
      type: Number,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updateddAt: {
      type: Date,
      default: Date.now,
    },
  });

export const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema,
  "Prescription"
);

console.log("Prescription model");
