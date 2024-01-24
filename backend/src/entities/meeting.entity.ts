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
    rate: number
    
    @Column()
    doctorId: number
    
    @Column({default: 'Pendiente'})
    status: string
    
    @Column({nullable: true})
    medicalRecordDatetime: Date

    @Column({nullable: true})
    tpc: string

    @Column({nullable: true})
    motive: string

    @Column({nullable: true})
    cancelDate: Date

    @ManyToOne(() => User, user => user.meetings, {nullable: false})
    user: User
    
    @ManyToOne(() => Doctor, doctor => doctor.meetings, {nullable: false})
    doctor: Doctor

    @OneToOne(() => MedicalRecord, medicalRecord => medicalRecord.meeting)
    @JoinColumn()
    medicalRecord: MedicalRecord
    
    @OneToMany(() => Comment, comment => comment.meeting, {nullable: false})
    comments: Comment
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}