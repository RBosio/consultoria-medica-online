export class ScheduleResponseDto {
    day: number
    schedule: ScheduleAvailable[]
}

class ScheduleAvailable {
    time: string
    available: boolean
}