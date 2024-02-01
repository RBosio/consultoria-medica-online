import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

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

    @ManyToOne(() => User, user => user.meetings, {nullable: false})
    @JoinColumn({name: 'userIdSend'})
    userSend: User

    @ManyToOne(() => User, user => user.meetings, {nullable: false})
    @JoinColumn({name: 'userIdReceive'})
    userReceive: User
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}