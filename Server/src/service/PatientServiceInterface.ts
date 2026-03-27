import mongoose from "mongoose";
import { IEMRModel } from "../database/mongo/model/EMR";
import { AllergyDTO } from "../dto/AllergyDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import { ClinicDTO } from "../dto/ClinicDTO";
import { FileDTO } from "../dto/FileDTO";
import { Patient } from "../dto/Patient";
import { TimeSlot } from "../dto/TimeSlot";
import { User } from "../dto/User";

export interface PatientServiceInterface {
  signin(user: User): Promise<Patient>;
  signup(patient: Patient): Promise<Patient>;
  reserveTimeSlot(timeSlot: TimeSlot): Promise<TimeSlot>;
  deleteReservedTimeSlot(timeSlot: TimeSlot): Promise<void>;
  payOnline(clinicDTO: ClinicDTO, patient_id: number): Promise<string>;
  getSchedule(patient_id: number): Promise<any>;
  addAllergy(
    allergyDTO: AllergyDTO,
    files: FileDTO[],
    patient: Patient,
  ): Promise<IEMRModel>;
  getAllAllergy(patient: Patient): Promise<AllergyDTO[]>;
  addChronicIllness(
    chronicIllnessDTO: ChronicIllnessDTO,
    files: FileDTO[],
    patient: Patient,
  ): Promise<IEMRModel>;
  getAllChronicIllness(patient: Patient): Promise<ChronicIllnessDTO[]>;
  getAllergyFile(
    patient: Patient,
    file_id: string,
  ): Promise<mongoose.mongo.GridFSBucketReadStream>;
  getChronicIllnessFile(
    patient: Patient,
    file_id: string,
  ): Promise<mongoose.mongo.GridFSBucketReadStream>;
}
