import { DoctorResponseDto } from "./doctor.dto"
import { HealthInsuranceResponseDto } from "./healthInsurance.dto"

export interface UserResponseDto {
    id: number
    dni: string
    name: string
    surname: string
    email: string
    gender: string
    phone: string
    image: string
    validateHealthInsurance: boolean
    birthday: Date
    healthInsurances: HealthInsuranceResponseDto[]
    token?: string
    doctor?: DoctorResponseDto
}