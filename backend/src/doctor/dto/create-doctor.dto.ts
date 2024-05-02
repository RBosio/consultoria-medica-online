import { IsDateString, IsDefined } from "class-validator"
import { Speciality } from "src/entities/speciality.entity"

export class createDoctorDto {
    
    @IsDefined()
    registration: any
   
    @IsDefined()
    title: any

    @IsDefined()
    specialitiesStr: string

    @IsDefined()
    @IsDateString()
    employmentDate: Date
}