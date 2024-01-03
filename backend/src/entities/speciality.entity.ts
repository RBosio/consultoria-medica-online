import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Doctor } from './doctor.entity'
import { Meeting } from './meeting.entity'

@Entity()
export class Speciality {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @ManyToMany(() => Doctor, doctors => doctors.specialities)
    doctors: Doctor[]

    @OneToMany(() => Meeting, meetings => meetings.speciality)
    meetings: Meeting[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}