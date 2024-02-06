import { PlanResponseDto } from "./plan.dto"

export interface BenefitResponseDto {
    id: number
    name: string
    plans: PlanResponseDto[]
}