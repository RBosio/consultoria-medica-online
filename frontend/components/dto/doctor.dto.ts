import { PlanResponseDto } from "./plan.dto";
import { ScheduleResponseDto } from "./schedule.dto";
import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface DoctorResponseDto {
  id: number;
  description: string;
  avgRate: number;
  count: number;
  priceMeeting: number;
  durationMeeting: number;
  planId?: number;
  user: UserResponseDto;
  specialities: SpecialityResponseDto[];
  schedules: ScheduleResponseDto[];
  verified: boolean;
  verifiedSince: Date;
  plan: PlanResponseDto;
  planSince: Date;
  planLastPayment: Date;
  registration: string;
  title: string;
  cbu: string;
  alias: string;
}
