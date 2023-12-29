import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { MedicalRecord } from './medical-record.entity'

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string
    
    @Column()
    medicalRecordDatetime: Date

    @ManyToOne(() => MedicalRecord, medicalRecord => medicalRecord.files)
    medicalRecord: MedicalRecord
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}