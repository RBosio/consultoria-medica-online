import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Meeting } from './meeting.entity'
import { User } from './user.entity'

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

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'userCommentId' })
    user: User
}