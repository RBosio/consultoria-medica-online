import { FileResponseDto } from "./file.dto"
import { MeetingResponseDto } from "./meeting.dto"

export interface MedicalRecordResponse {
    id: number
    datetime: Date
    detail: string
    observations?: string
    files: FileResponseDto[]
    meeting: MeetingResponseDto
}