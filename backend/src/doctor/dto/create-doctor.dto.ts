import { IsDateString, IsDefined, IsIn, IsInt, Length, Matches } from "class-validator"
import { Speciality } from "src/entities/speciality.entity"

export class createDoctorDto {
    @IsDefined()
    @Matches(/^(20|23|24|27|30|33|34)\d{8}\d{1}$/gm)
    cuil: string

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
    @Length(1)
    address: string

    @IsDefined()
    planId: number

    @IsDefined()
    specialities: Speciality[]

    @IsDefined()
    verified: boolean
}