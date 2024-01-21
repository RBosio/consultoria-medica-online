import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Meeting } from './meeting.entity'
import { User } from './user.entity'
import { File } from './file.entity'

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

    @OneToMany(() => File, file => file.comment)
    files: File[]
    
    @ManyToOne(() => Meeting, meeting => meeting.comments, {nullable: false})
    meeting: Meeting

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'userCommentId' })
    user: User
}