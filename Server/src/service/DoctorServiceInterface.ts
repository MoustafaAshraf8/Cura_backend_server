import mongoose from "mongoose";
import { IEMRModel } from "../database/mongo/model/EMR";
import { AllergyDTO } from "../dto/AllergyDTO";
import { ChronicIllnessDTO } from "../dto/ChronicIllnessDTO";
import { ClinicDTO } from "../dto/ClinicDTO";
import { FileDTO } from "../dto/FileDTO";
import { Patient } from "../dto/Patient";
import { TimeSlot } from "../dto/TimeSlot";
import { User } from "../dto/User";

export interface DoctorServiceInterface {}
