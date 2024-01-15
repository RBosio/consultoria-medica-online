import { DoctorResponseDto } from "./doctor.dto";
import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface MeetingResponseDto {
    startDatetime: Date
    user: UserResponseDto
    doctor: DoctorResponseDto
    speciality: SpecialityResponseDto
}