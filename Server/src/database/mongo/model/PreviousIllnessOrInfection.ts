import mongoose, { Document, Schema } from "mongoose";

export interface IPreviousIllnessOrInfection {
  illness: string;
  diagnosisDate: Date;
  treatment: string;
  recoveryDate?: Date;
  notes?: string;
  file: mongoose.Types.ObjectId[];
}

export interface IPreviousIllnessOrInfectionModel
  extends IPreviousIllnessOrInfection,
    mongoose.Document {}

export const previousIllnessOrInfectionSchema: mongoose.Schema<IPreviousIllnessOrInfectionModel> =
  new mongoose.Schema<IPreviousIllnessOrInfectionModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    illness: { type: String, required: true },
    diagnosisDate: { type: Date, required: true },
    treatment: { type: String, required: true },
    recoveryDate: { type: Date },
    notes: { type: String },
    file: [
      {
        type: mongoose.Types.ObjectId,
        ref: "PreviousIllnessOrInfectionGridFSBucket.files",
      },
    ],
  });

export const PreviousIllnessOrInfection =
  mongoose.model<IPreviousIllnessOrInfectionModel>(
    "PreviousIllnessOrInfection",
    previousIllnessOrInfectionSchema,
    "PreviousIllnessOrInfection"
  );
