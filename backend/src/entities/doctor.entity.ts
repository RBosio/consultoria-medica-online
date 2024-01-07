import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Schedule } from './schedule.entity'
import { Speciality } from './speciality.entity'
import { Meeting } from './meeting.entity'

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    registration: string
    
    @Column()
    cuil: string
    
    @Column({nullable: true})
    title: string
    
    @Column({nullable: true})
    durationMeeting: number

    @Column({nullable: true})
    priceMeeting: number
    
    @Column({default: false})
    verified: boolean

    @Column()
    userId: number
    
    @OneToOne(() => User, {nullable: false})
    @JoinColumn()
    user: User
    
    @OneToMany(() => Meeting, meetings => meetings.doctor)
    meetings: Meeting[]

    @OneToMany(() => Schedule, schedules => schedules.doctor)
    schedules: Schedule[]
    
    @ManyToMany(() => Speciality, specialities => specialities.doctors)
    @JoinTable()
    specialities: Speciality[]
}