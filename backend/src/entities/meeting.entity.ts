import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'
import { Doctor } from './doctor.entity'
import { MedicalRecord } from './medical-record.entity'
import { Comment } from './comment.entity'
import { Speciality } from './speciality.entity'

@Entity()
export class Meeting {
    @PrimaryColumn()
    userId: number

    @PrimaryColumn()
    startDatetime: Date

    @Column({nullable: true})
    calification: number
    
    @Column()
    doctorId: number
    
    @Column({default: true})
    status: boolean
    
    @Column({nullable: true})
    medicalRecordDatetime: Date

    @Column({nullable: true})
    tpc: string

    @ManyToOne(() => User, user => user.meetings, {nullable: false})
    user: User
    
    @ManyToOne(() => Doctor, doctor => doctor.meetings, {nullable: false})
    doctor: Doctor

    @ManyToOne(() => Speciality, speciality => speciality.meetings, {nullable: false})
    speciality: Speciality
    
    @OneToOne(() => MedicalRecord, medicalRecord => medicalRecord.meeting)
    @JoinColumn()
    medicalRecord: MedicalRecord
    
    @OneToMany(() => Comment, comment => comment.meeting, {nullable: false})
    comments: Comment
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}