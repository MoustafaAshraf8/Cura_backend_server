import { Patient } from "../dto/Patient";
import { User } from "../dto/User";
import { IEMRModel } from "../database/mongo/model/EMR";
import { AllergyDTO } from "../dto/AllergyDTO";
import { IAllergyModel } from "../database/mongo/model/Allergy";
import { FileDTO } from "../dto/FileDTO";
import mongoose from "mongoose";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import { IChronicIllnessModel } from "../database/mongo/model/ChronicIllness";
import { DoctorDTO } from "../dto/DoctorDTO";
import { TimeSlot } from "../dto/TimeSlot";
import { ClinicDTO } from "../dto/ClinicDTO";
export interface PatientRepository {
  signin(user: User): Promise<Patient>;
  signup(patient: Patient): Promise<Patient>;
  authorize(patient_id: number): Promise<Patient>;
  getEMR(patient_id: number): Promise<IEMRModel>;
  addAllergy(allergyDTO: AllergyDTO): Promise<IAllergyModel>;
  getAllAllergy(patient: Patient): Promise<AllergyDTO[]>;
  addAllergyFile(
    file: FileDTO,
  ): Promise<mongoose.mongo.GridFSBucketWriteStream>;
  getAllergyFile(
    file_id: string,
  ): Promise<mongoose.mongo.GridFSBucketReadStream>;
  addChronicIllness(
    chronicIllnessDTO: ChronicIllnessDTO,
  ): Promise<IChronicIllnessModel>;
  getAllChronicIllness(patient: Patient): Promise<ChronicIllnessDTO[]>;
  addChronicIllnessFile(
    file: FileDTO,
  ): Promise<mongoose.mongo.GridFSBucketWriteStream>;
  getChronicIllnessFile(
    file_id: string,
  ): Promise<mongoose.mongo.GridFSBucketReadStream>;
  getDoctorProfileFromTimeSlot(timeslot_id: number): Promise<DoctorDTO>;
  deleteReservationByPatient(targetTimeSlot: TimeSlot): Promise<void>;
  getPatientSchedule(patient_id: number): Promise<any>;
  getClinicData(clinicDTO: ClinicDTO): Promise<ClinicDTO>;
}
