import mongoose, { Document, Schema } from "mongoose";

interface ISurgeryOrProcedure extends Document {
  procedure: string;
  date: Date;
  outcome: string;
  complications?: string;
  notes?: string;
  // fileId?: mongoose.Types.ObjectId; // File ID from GridFS
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
    // fileId: { type: mongoose.Types.ObjectId, ref: "ReportFile" },
  });

export const SurgeryOrProcedure = mongoose.model<ISurgeryOrProcedureModel>(
  "SurgeryOrProcedure",
  surgeryOrProcedureSchema,
  "SurgeryOrProcedure"
);
