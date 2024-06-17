import mongoose, { Document, Schema } from "mongoose";

interface IChronicIllness extends Document {
  illness: string;
  diagnosisDate: Date;
  treatment: string;
  // recoveryDate?: Date;
  notes?: string;
  // fileId?: mongoose.Types.ObjectId; // File ID from GridFS
}
export interface IChronicIllnessModel
  extends IChronicIllness,
    mongoose.Document {}

export const chronicIllnessSchema: mongoose.Schema<IChronicIllnessModel> =
  new mongoose.Schema<IChronicIllnessModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    illness: { type: String, required: true },
    diagnosisDate: { type: Date, required: true },
    treatment: { type: String, required: true },
    // recoveryDate: { type: Date },
    notes: { type: String, required: false },
    // fileId: { type: mongoose.Types.ObjectId, ref: 'ReportFile' }
  });

export const ChronicIllness = mongoose.model<IChronicIllnessModel>(
  "ChronicIllness",
  chronicIllnessSchema,
  "ChronicIllness"
);
