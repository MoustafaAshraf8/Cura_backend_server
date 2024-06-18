import mongoose from "mongoose";
import { IEMR, IEMRModel } from "../database/mongo/model/EMR";
import { all } from "axios";

export class EMRDTO implements IEMR {
  _id: mongoose.Types.ObjectId | null;
  patient_id: number;
  chronicIllnesse: mongoose.Types.ObjectId[];
  previousIllnessesOrInfection: mongoose.Types.ObjectId[];
  surgeriesOrProcedure: mongoose.Types.ObjectId[];
  allergy: mongoose.Types.ObjectId[];
  immunization: mongoose.Types.ObjectId[];

  constructor(
    _id: mongoose.Types.ObjectId | null,
    patient_id: number,
    chronicIllnesse: mongoose.Types.ObjectId[],
    previousIllnessesOrInfection: mongoose.Types.ObjectId[],
    surgeriesOrProcedure: mongoose.Types.ObjectId[],
    allergy: mongoose.Types.ObjectId[],
    immunization: mongoose.Types.ObjectId[]
  ) {
    this._id = _id;
    this.patient_id = patient_id;
    this.chronicIllnesse = chronicIllnesse;
    this.previousIllnessesOrInfection = previousIllnessesOrInfection;
    this.surgeriesOrProcedure = surgeriesOrProcedure;
    this.allergy = allergy;
    this.immunization = immunization;
  }

  static fromJson = (json: any): EMRDTO => {
    return new EMRDTO(
      json.hasOwnProperty("_id") ? json._id : null,
      json.patient_id,
      json.chronicIllnesse,
      json.previousIllnessesOrInfection,
      json.surgeriesOrProcedure,
      json.allergy,
      json.immunization
    );
  };
}
