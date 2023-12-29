import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Meeting } from './meeting.entity'

@Entity()
export class Comment {
    @PrimaryColumn()
    meetingUserId: number

    @PrimaryColumn({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    datetime: Date

    @Column()
    meetingStartDatetime: Date
    
    @Column()
    comment: string
    
    @Column()
    userCommentId: number

    @ManyToOne(() => Meeting, meeting => meeting.comments, {nullable: false})
    meeting: Meeting
}