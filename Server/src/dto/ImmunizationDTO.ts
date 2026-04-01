import mongoose from "mongoose";
import { IImmunization } from "../database/mongo/model/Immunization";
export class ImmunizationDTO implements IImmunization {
  _id: mongoose.Types.ObjectId | null;
  vaccine: string;
  dateAdministered: Date;
  dose?: string;
  provider?: string;
  notes?: string;
  file: mongoose.Types.ObjectId[];

  constructor(
    _id: mongoose.Types.ObjectId | null,
    vaccine: string,
    dateAdministered: Date,
    file: mongoose.Types.ObjectId[],
    dose: string,
    provider: string,
    notes: string
  ) {
    this._id = _id;
    this.vaccine = vaccine;
    this.dateAdministered = dateAdministered;
    this.dose = dose;
    this.provider = provider;
    this.notes = notes;
    this.file = file;
  }

  static fromJson = (json: any): ImmunizationDTO => {
    return new ImmunizationDTO(
      json.hasOwnProperty("_id") ? json._id : null,
      json.vaccine,
      json.dateAdministered,
      json.dose,
      json.provider,
      json.notes,
      json.hasOwnProperty("file") ? json.file : []
    );
  };
}
