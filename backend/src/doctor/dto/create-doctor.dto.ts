import { IsDateString, IsDefined, IsIn, IsInt, Length, Matches } from "class-validator"
import { Speciality } from "src/entities/speciality.entity"

export class createDoctorDto {
    @IsDefined()
    @IsIn([10,15,30,45,60])
    durationMeeting: number
    
    @IsDefined()
    @IsInt()
    priceMeeting: number

    @IsDefined()
    @IsDateString()
    employmentDate: Date
    
    @IsDefined()
    @Length(1)
    description: string
    
    @IsDefined()
    planId: number

    @IsDefined()
    specialities: Speciality[]

    @IsDefined()
    verified: boolean
}