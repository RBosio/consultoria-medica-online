import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Meeting } from './meeting.entity'

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    userIdSend: number

    @Column()
    userIdReceive: number

    @Column()
    type: string

    @Column({ default: false })
    readed: boolean

    @ManyToOne(() => User, user => user.notificationsSend, {nullable: false})
    @JoinColumn({name: 'userIdSend'})
    userSend: User

    @ManyToOne(() => User, user => user.notificationsReceive, {nullable: false})
    @JoinColumn({name: 'userIdReceive'})
    userReceive: User

    @ManyToOne(() => Meeting, meeting => meeting.notifications)
    meeting: Meeting
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}