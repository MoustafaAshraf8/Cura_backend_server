import mongoose from "mongoose";

export interface IChronicIllness {
  illness: string;
  diagnosisDate: Date;
  treatment: string;
  // recoveryDate?: Date;
  notes?: string;
  file: mongoose.Types.ObjectId[];
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
    file: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ChronicIllnessGridFSBucket.files",
      },
    ],
  });

export const ChronicIllness = mongoose.model<IChronicIllnessModel>(
  "ChronicIllness",
  chronicIllnessSchema,
  "ChronicIllness"
);
