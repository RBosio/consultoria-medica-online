import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { MedicalRecord } from './medical-record.entity'
import { Comment } from './comment.entity'

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    url: string

    @Column({ nullable: false })
    name: string
    
    @Column({ nullable: true })
    medicalRecordDatetime: Date
    
    @Column({ nullable: true })
    commentMeetingUserId: number

    @Column({ nullable: true })
    commentDatetime: Date

    @ManyToOne(() => MedicalRecord, medicalRecord => medicalRecord.files)
    medicalRecord: MedicalRecord

    @ManyToOne(() => Comment, comment => comment.files)
    comment: Comment
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}