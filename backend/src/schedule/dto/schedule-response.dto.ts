export class ScheduleResponseDto {
    day?: number
    date?: string
    schedule: ScheduleAvailable[]
}

class ScheduleAvailable {
    time: string
    available: boolean
}