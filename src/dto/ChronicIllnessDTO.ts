import mongoose from "mongoose";
import { IChronicIllness } from "../database/mongo/model/ChronicIllness";
export class ChronicIllnessDTO implements IChronicIllness {
  _id: mongoose.Types.ObjectId | null;
  illness: string;
  diagnosisDate: Date;
  treatment: string;
  // recoveryDate?: Date;
  notes?: string;
  file: mongoose.Types.ObjectId[];

  constructor(
    _id: mongoose.Types.ObjectId | null,
    illness: string,
    diagnosisDate: Date,
    treatment: string,
    // recoveryDate?: Datestring,
    file: mongoose.Types.ObjectId[],
    notes?: string
  ) {
    this._id = _id;
    this.illness = illness;
    this.diagnosisDate = diagnosisDate;
    this.treatment = treatment;
    this.notes = notes;
    this.file = file;
  }

  static fromJson = (json: any): ChronicIllnessDTO => {
    return new ChronicIllnessDTO(
      json.hasOwnProperty("_id") ? json._id : null,
      json.illness,
      json.diagnosisDate,
      json.treatment,
      json.notes,
      json.file
    );
  };
}
