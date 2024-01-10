import { Speciality } from "src/entities/speciality.entity"

export class createDoctorDto {
    cuil: string
    durationMeeting: number
    priceMeeting: number
    employmentDate: Date
    specialities: Speciality[]
}