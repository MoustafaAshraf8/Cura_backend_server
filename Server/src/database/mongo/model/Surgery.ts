import mongoose from "mongoose";

interface ISurgery {
  scan: mongoose.Types.ObjectId[];
  name: String;
  createdAt: Date;
  updateddAt: Date;
}

export interface ISurgeryModel extends ISurgery, mongoose.Document {}

export const surgerySchema: mongoose.Schema<ISurgeryModel> =
  new mongoose.Schema<ISurgeryModel>({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    scan: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    name: {
      type: String,
      required: true,
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

export const Surgery = mongoose.model<ISurgeryModel>(
  "Surgery",
  surgerySchema,
  "Surgery"
);

console.log("Surgery model");
