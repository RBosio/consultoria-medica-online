import { Auth } from "../../../shared/types";
import { DoctorResponseDto } from "./doctor.dto";
import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface MeetingResponseDto {
  id: number;
  startDatetime: Date;
  status: string;
  tpc: string;
  user: UserResponseDto;
  doctor: DoctorResponseDto;
  specialities: SpecialityResponseDto[];
  motive?: string;
  cancelDate?: Date;
  auth?: Auth;
}
