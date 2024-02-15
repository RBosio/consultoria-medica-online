import { Meeting } from "src/entities/meeting.entity"

export class joinMeetingResponseDto {
    tokenMeeting: string
    meeting: Meeting
}