import mongoose from "mongoose";
import { ISurgeryOrProcedure } from "../database/mongo/model/SurgeryOrProcedure";

export class SurgeryOrProcedureDTO implements ISurgeryOrProcedure {
  _id: mongoose.Types.ObjectId | null;
  procedure: string;
  date: Date;
  outcome: string;
  complications?: string;
  notes?: string;
  file: mongoose.Types.ObjectId[];

  constructor(
    _id: mongoose.Types.ObjectId | null,
    procedure: string,
    date: Date,
    outcome: string,
    file: mongoose.Types.ObjectId[],
    complications?: string,
    notes?: string
  ) {
    this._id = _id;
    this.procedure = procedure;
    this.date = date;
    this.outcome = outcome;
    this.complications = complications;
    this.notes = notes;
    this.file = file;
  }

  static fromJson = (json: any): SurgeryOrProcedureDTO => {
    return new SurgeryOrProcedureDTO(
      json.hasOwnProperty("_id") ? json._id : null,
      json.procedure,
      json.date,
      json.outcome,
      json.hasOwnProperty("file") ? json.file : [],
      json.complications,
      json.notes
    );
  };
}
