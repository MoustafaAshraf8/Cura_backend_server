import mongoose from "mongoose";
import { IPreviousIllnessOrInfection } from "../database/mongo/model/PreviousIllnessOrInfection";

export class PreviousIllnessOrInfectionDTO
  implements IPreviousIllnessOrInfection
{
  _id: mongoose.Types.ObjectId | null;
  illness: string;
  diagnosisDate: Date;
  treatment: string;
  recoveryDate?: Date;
  notes?: string;
  file: mongoose.Types.ObjectId[];
  constructor(
    _id: mongoose.Types.ObjectId | null,
    illness: string,
    diagnosisDate: Date,
    treatment: string,
    file: mongoose.Types.ObjectId[],
    recoveryDate: Date,
    notes: string
  ) {
    this._id = _id;
    this.illness = illness;
    this.diagnosisDate = diagnosisDate;
    this.treatment = treatment;
    this.recoveryDate = recoveryDate;
    this.notes = notes;
    this.file = file;
  }

  static fromJson = (json: any): PreviousIllnessOrInfectionDTO => {
    return new PreviousIllnessOrInfectionDTO(
      json.hasOwnProperty("_id") ? json._id : null,
      json.illness,
      json.diagnosisDate,
      json.treatment,
      json.recoveryDate,
      json.notes,
      json.hasOwnProperty("file") ? json.file : []
    );
  };
}
