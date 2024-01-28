import { HealthInsuranceResponseDto } from "./healthInsurance.dto"

export interface UserResponseDto {
    id: number
    dni: string
    name: string
    surname: string
    email: string
    gender: string
    phone: string
    photo: string
    birthday: Date
    healthInsurances: HealthInsuranceResponseDto[]
}