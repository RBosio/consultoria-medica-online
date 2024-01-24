import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Meeting } from './meeting.entity'
import { User } from './user.entity'
import { File } from './file.entity'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    meetingUserId: number

    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    datetime: Date

    @Column()
    meetingStartDatetime: Date
    
    @Column()
    comment: string
    
    @Column()
    userCommentId: number

    @OneToOne(() => File, file => file.comment)
    files: File[]
    
    @ManyToOne(() => Meeting, meeting => meeting.comments, {nullable: false})
    meeting: Meeting

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'userCommentId' })
    user: User
}