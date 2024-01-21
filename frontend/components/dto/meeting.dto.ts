import { DoctorResponseDto } from "./doctor.dto";
import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface MeetingResponseDto {
    id : number
    startDatetime: Date
    status: string
    motive: string
    user: UserResponseDto
    doctor: DoctorResponseDto
    speciality: SpecialityResponseDto
}