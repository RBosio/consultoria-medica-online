import { UserResponseDto } from "./user.dto";

export interface DoctorResponseDto {
    description: string
    avgRate: number
    address: string
    user: UserResponseDto
}