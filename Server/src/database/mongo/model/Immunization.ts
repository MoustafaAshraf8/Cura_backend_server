import mongoose, { Document, Schema } from "mongoose";

export interface IImmunization {
  vaccine: string;
  dateAdministered: Date;
  dose?: string;
  provider?: string;
  notes?: string;
  file: mongoose.Types.ObjectId[];
}

export interface IImmunizationModel extends IImmunization, mongoose.Document {}

export const immunizationSchema: mongoose.Schema<IImmunizationModel> =
  new mongoose.Schema<IImmunizationModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    vaccine: { type: String, required: true },
    dateAdministered: { type: Date, required: true },
    dose: { type: String },
    provider: { type: String },
    notes: { type: String },
    file: [
      { type: mongoose.Types.ObjectId, ref: "ImmunizationGridFSBucket.files" },
    ],
  });

export const Immunization = mongoose.model<IImmunizationModel>(
  "Immunization",
  immunizationSchema,
  "Immunization"
);
