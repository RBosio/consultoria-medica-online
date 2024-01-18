import { HealthInsuranceResponseDto } from "./healthInsurance.dto"

export interface UserResponseDto {
    id: number
    name: string
    surname: string
    email: string
    photo: string
    phone: string
    healthInsurance: HealthInsuranceResponseDto
}