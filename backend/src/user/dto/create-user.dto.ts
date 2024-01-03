import { createDoctorDto } from "src/doctor/dto/create-doctor.dto"

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
    healthInsuranceId: number
    doctor?: createDoctorDto
}