import { SpecialityResponseDto } from "./speciality.dto";
import { UserResponseDto } from "./user.dto";

export interface DoctorResponseDto {
    description: string
    avgRate: number
    address: string
    planId?: number
    user: UserResponseDto
    specialities: SpecialityResponseDto[]
}