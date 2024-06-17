import mongoose, { Document, Schema } from "mongoose";

interface IPreviousIllnessOrInfection extends Document {
  illness: string;
  diagnosisDate: Date;
  treatment: string;
  recoveryDate?: Date;
  notes?: string;
  // fileId?: mongoose.Types.ObjectId; // File ID from GridFS
}

export interface IPreviousIllnessOrInfectionModel
  extends IPreviousIllnessOrInfection,
    mongoose.Document {}

export const previousIllnessOrInfectionSchema: mongoose.Schema<IPreviousIllnessOrInfectionModel> =
  new mongoose.Schema<IPreviousIllnessOrInfection>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    illness: { type: String, required: true },
    diagnosisDate: { type: Date, required: true },
    treatment: { type: String, required: true },
    recoveryDate: { type: Date },
    notes: { type: String },
    // fileId: { type: mongoose.Types.ObjectId, ref: 'ReportFile' }
  });

export const PreviousIllnessOrInfection =
  mongoose.model<IPreviousIllnessOrInfectionModel>(
    "PreviousIllnessOrInfection",
    previousIllnessOrInfectionSchema,
    "PreviousIllnessOrInfection"
  );
