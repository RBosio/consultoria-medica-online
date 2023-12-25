import { Speciality } from "src/entities/speciality.entity"

export class createDoctorDto {
    registration: string
    cuil: string
    title: string
    specialities: Speciality[]
}