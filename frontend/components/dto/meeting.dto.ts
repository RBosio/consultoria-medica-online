import { Auth } from "../../../shared/types";
import { DoctorResponseDto } from "./doctor.dto";
import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface MeetingResponseDto {
  userId?: number;
  startDatetime: Date;
  status: string;
  tpc: string;
  user: UserResponseDto;
  doctor: DoctorResponseDto;
  price: number;
  specialities: SpecialityResponseDto[];
  motive?: string;
  repr?: boolean;
  auth?: Auth;
  rate?: number;
}
