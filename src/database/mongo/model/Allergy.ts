import mongoose, { Document, Schema } from "mongoose";

interface IAllergy extends Document {
  allergen: string;
  reaction: string;
  severity: string;
  diagnosisDate: Date;
  notes?: string;
}

export interface IAllergyModel extends IAllergy, mongoose.Document {}

export const allergySchema: mongoose.Schema<IAllergyModel> =
  new mongoose.Schema<IAllergyModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    allergen: { type: String, required: true },
    reaction: { type: String, required: true },
    severity: { type: String, required: true },
    diagnosisDate: { type: Date, required: true },
    notes: { type: String },
  });

export const Allergy = mongoose.model<IAllergyModel>(
  "Allergy",
  allergySchema,
  "Allergy"
);
