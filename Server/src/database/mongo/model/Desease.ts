import mongoose from "mongoose";
import { IPrescriptionModel, prescriptionSchema } from "./Prescription";
interface IDesease {
  diagnose: String;
  note: String;
  prescription: IPrescriptionModel[];
  createdAt: mongoose.Date;
  updateddAt: mongoose.Date;
}

export interface IDeseaseModel extends IDesease, mongoose.Document {}

export const deseaseSchema: mongoose.Schema<IDeseaseModel> =
  new mongoose.Schema<IDeseaseModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    diagnose: {
      type: String,
    },
    note: {
      type: String,
    },
    prescription: {
      type: [prescriptionSchema],
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

export const Desease = mongoose.model<IDeseaseModel>(
  "Desease",
  deseaseSchema,
  "Desease"
);

console.log("Desease model");
