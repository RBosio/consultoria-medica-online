import { DoctorResponseDto } from "./doctor.dto"
import { UserHealthInsuranceResponseDto } from "./userHealthInsurance.dto"

export interface UserResponseDto {
    id: number
    dni: string
    address: string
    name: string
    surname: string
    email: string
    gender: string
    phone: string
    image: string
    city: number,
    birthday: Date
    healthInsurances: UserHealthInsuranceResponseDto[]
    token?: string
    doctor?: DoctorResponseDto
}