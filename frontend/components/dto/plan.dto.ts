import { BenefitResponseDto } from "./benefit.dto"

export interface PlanResponseDto {
    id: number
    name: string
    price: number
    benefits: BenefitResponseDto[]
}