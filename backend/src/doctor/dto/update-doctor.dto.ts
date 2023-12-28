import { Speciality } from "src/entities/speciality.entity"

export class updateDoctorDto {
    registration?: string
    cuil?: string
    title?: string
    durationMeeting?: number
    priceMeeting?: number
    specialities: Speciality[]
}