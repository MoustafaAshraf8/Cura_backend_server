import mongoose from "mongoose";
import { Desease } from "./Desease";
import { Surgery } from "./Surgery";

interface IEMR {
  patient_id: Number;
  desease: mongoose.Types.ObjectId[];
  surgery: mongoose.Types.ObjectId[];
}

export interface IEMRModel extends IEMR, mongoose.Document {}

export const emrSchema: mongoose.Schema<IEMRModel> =
  new mongoose.Schema<IEMRModel>({
    _id: {
      type: mongoose.Types.ObjectId,
      auto: true,
    },
    patient_id: {
      type: Number,
      required: true,
    },
    desease: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Desease" }],
    },
    surgery: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Surgery" }],
    },
  });

export const EMR = mongoose.model<IEMRModel>("EMR", emrSchema, "EMR");

console.log("EMR model");
