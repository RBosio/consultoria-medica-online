import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Schedule } from './schedule.entity'
import { Speciality } from './speciality.entity'
import { Meeting } from './meeting.entity'
import { Plan } from './plan.entity'

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
    
    @Column({default: 0})
    priceMeeting: number
    
    @Column({default: false})
    verified: boolean
    
    @Column({default: 0, type: 'decimal', precision: 2, scale: 1})
    avgRate: number

    @Column({ type: 'text', nullable: true})
    description: string

    @Column()
    employmentDate: Date
    
    @Column()
    userId: number
    
    @Column({nullable: true})
    planId: number
    
    seniority: number
    
    @OneToOne(() => User, {nullable: false})
    @JoinColumn()
    user: User
    
    @OneToMany(() => Meeting, meetings => meetings.doctor)
    meetings: Meeting[]

    @OneToMany(() => Schedule, schedules => schedules.doctor)
    schedules: Schedule[]

    @ManyToOne(() => Plan, plan => plan.doctors)
    plan: Plan
    
    @ManyToMany(() => Speciality, specialities => specialities.doctors)
    @JoinTable()
    specialities: Speciality[]
    
}