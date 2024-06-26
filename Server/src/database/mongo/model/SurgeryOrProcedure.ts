import mongoose, { Document, Schema } from "mongoose";

export interface ISurgeryOrProcedure {
  procedure: string;
  date: Date;
  outcome: string;
  complications?: string;
  notes?: string;
  file: mongoose.Types.ObjectId[];
}

export interface ISurgeryOrProcedureModel
  extends ISurgeryOrProcedure,
    mongoose.Document {}

export const surgeryOrProcedureSchema: mongoose.Schema<ISurgeryOrProcedureModel> =
  new mongoose.Schema<ISurgeryOrProcedureModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    procedure: { type: String, required: true },
    date: { type: Date, required: true },
    outcome: { type: String, required: true },
    complications: { type: String },
    notes: { type: String },
    file: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SurgeryOrProcedureGridFSBucket.files",
      },
    ],
  });

export const SurgeryOrProcedure = mongoose.model<ISurgeryOrProcedureModel>(
  "SurgeryOrProcedure",
  surgeryOrProcedureSchema,
  "SurgeryOrProcedure"
);
