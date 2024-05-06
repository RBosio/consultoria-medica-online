import { HealthInsuranceResponseDto } from "./healthInsurance.dto";
import { MeetingResponseDto } from "./meeting.dto";
import { UserResponseDto } from "./user.dto";

export interface NotificationResponseDto {
  id: number;
  userIdSend: number;
  userIdReceive: number;
  meetingStartDatetime: Date;
  type: string;
  readed: boolean;
  created_at: Date;
  userSend: UserResponseDto;
  meeting: MeetingResponseDto;
  healthInsurance: HealthInsuranceResponseDto;
  mStartDOld: Date;
  mStartDNew: Date;
}
