import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm'
import { Meeting } from './meeting.entity'

@Entity()
export class MedicalRecord {
    @PrimaryColumn()
    datetime: Date

    @Column()
    detail: string
    
    @Column({nullable: true})
    observations: string

    @OneToOne(() => Meeting, meeting => meeting.medicalRecord, {nullable: false})
    meeting: Meeting
}