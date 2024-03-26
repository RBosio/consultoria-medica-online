import { HealthInsuranceResponseDto } from "./healthInsurance.dto"
import { UserResponseDto } from "./user.dto"

export interface UserHealthInsuranceResponseDto {
    healthInsurance: HealthInsuranceResponseDto
    user: UserResponseDto
    verified: boolean
    file_name: string
    file_url: string
}