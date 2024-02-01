import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface DoctorResponseDto {
    id: number
    description: string
    avgRate: number
    address: string
    priceMeeting: number
    durationMeeting: number
    planId?: number
    user: UserResponseDto
    specialities: SpecialityResponseDto[]
    verified: boolean
}