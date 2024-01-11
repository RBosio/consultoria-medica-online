import { Benefit } from "src/entities/benefit.entity"

export class createPlanDto {
    name: string
    price: number
    benefits: Benefit[]
}