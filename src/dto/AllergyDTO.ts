import mongoose, { ObjectId } from "mongoose";
import { IAllergy } from "../database/mongo/model/Allergy";

export class AllergyDTO implements IAllergy {
  _id: mongoose.Types.ObjectId | null;
  allergen: string;
  reaction: string;
  severity: string;
  diagnosisDate: Date;
  notes?: string;
  file: mongoose.Types.ObjectId[];
  constructor(
    _id: mongoose.Types.ObjectId | null,
    allergen: string,
    reaction: string,
    severity: string,
    diagnosisDate: Date,
    notes: string,
    file: mongoose.Types.ObjectId[]
  ) {
    this._id = _id;
    this.allergen = allergen;
    this.reaction = reaction;
    this.severity = severity;
    this.diagnosisDate = diagnosisDate;
    this.notes = notes;
    this.file = file;
  }

  static fromJson = (json: any): AllergyDTO => {
    return new AllergyDTO(
      json.hasOwnProperty("_id") ? json._id : null,
      json.allergen,
      json.reaction,
      json.severity,
      json.diagnosisDate,
      json.notes,
      json.hasOwnProperty("file") ? json.file : []
    );
  };

  public toJson = (): Object => {
    return {
      allergen: this.allergen,
      reaction: this.reaction,
      severity: this.severity,
      diagnosisDate: this.diagnosisDate,
      notes: this.notes,
      file: this.file,
    };
  };
}
