import { createDoctorDto } from "src/doctor/dto/create-doctor.dto"
import { HealthInsurance } from "src/entities/health-insurance.entity"

export class createUserDto {
    name: string
    surname: string
    email: string
    password: string
    dni: string
    cuit: string
    phone?: string
    birthday: Date
    admin?: boolean
    gender: boolean
    zipCode: string
    healthInsurances?: HealthInsurance[]
    his: number[]
    doctor?: createDoctorDto
}