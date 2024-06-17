import mongoose from "mongoose";
// import { IChronicIllnessModel, chronicIllnessSchema } from "./ChronicIllness";
// import {
//   IPreviousIllnessOrInfectionModel,
//   previousIllnessOrInfectionSchema,
// } from "./PreviousIllnessOrInfection";
// import {
//   ISurgeryOrProcedureModel,
//   surgeryOrProcedureSchema,
// } from "./SurgeryOrProcedure";
// import { IImmunizationModel, immunizationSchema } from "./Immunization";
// import { IAllergyModel, allergySchema } from "./Allergy";
// interface IEMR {
//   patient_id: Number;
//   ChronicIllness: IChronicIllnessModel[];
//   PreviousIllnessOrInfection: IPreviousIllnessOrInfectionModel[];
//   SurgeryOrProcedure: ISurgeryOrProcedureModel[];
//   Allergy: IAllergyModel[];
//   Immunization: IImmunizationModel[];
// }

// export interface IEMRModel extends IEMR, mongoose.Document {}

// export const emrSchema: mongoose.Schema<IEMRModel> =
//   new mongoose.Schema<IEMRModel>({
//  _id: {
//    type: mongoose.Types.ObjectId,
//    auto: true,
//  },
//  patient_id: {
//    type: Number,
//    required: true,
//  },
//     ChronicIllness: {
//       type: [chronicIllnessSchema],
//     },
//     PreviousIllnessOrInfection: {
//       type: [previousIllnessOrInfectionSchema],
//     },
//     SurgeryOrProcedure: {
//       type: [surgeryOrProcedureSchema],
//     },
//     Allergy: {
//       type: [allergySchema],
//     },
//     Immunization: {
//       type: [immunizationSchema],
//     },
//   });

// export const EMR = mongoose.model<IEMRModel>("EMR", emrSchema, "EMR");

// console.log("EMR model");

export interface IEMR extends Document {
  patient_id: number;
  chronicIllnesse: mongoose.Types.ObjectId[];
  previousIllnessesOrInfection: mongoose.Types.ObjectId[];
  surgeriesOrProcedure: mongoose.Types.ObjectId[];
  allergy: mongoose.Types.ObjectId[];
  immunization: mongoose.Types.ObjectId[];
}

export interface IEMRModel extends IEMR, mongoose.Document {}

const emrSchema: mongoose.Schema<IEMRModel> = new mongoose.Schema<IEMRModel>({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true,
  },
  patient_id: {
    type: Number,
    required: true,
  },
  chronicIllnesse: [{ type: mongoose.Types.ObjectId, ref: "ChronicIllness" }],
  previousIllnessesOrInfection: [
    { type: mongoose.Types.ObjectId, ref: "PreviousIllnessOrInfection" },
  ],
  surgeriesOrProcedure: [
    { type: mongoose.Types.ObjectId, ref: "SurgeryOrProcedure" },
  ],
  allergy: [{ type: mongoose.Types.ObjectId, ref: "Allergy" }],
  immunization: [{ type: mongoose.Types.ObjectId, ref: "Immunization" }],
});

export const EMR = mongoose.model<IEMRModel>("EMR", emrSchema, "EMR");
