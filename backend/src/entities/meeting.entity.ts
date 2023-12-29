import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'
import { Doctor } from './doctor.entity'
import { MedicalRecord } from './medical-record.entity'

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
    
    @Column({nullable: true})
    url: string
    
    @Column({default: true})
    status: boolean
    
    @Column({nullable: true})
    medicalRecordDatetime: Date

    @ManyToOne(() => User, user => user.meetings, {nullable: false})
    user: User

    @ManyToOne(() => Doctor, doctor => doctor.meetings, {nullable: false})
    doctor: Doctor

    @OneToOne(() => MedicalRecord, medicalRecord => medicalRecord.meeting)
    @JoinColumn()
    medicalRecord: MedicalRecord
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}