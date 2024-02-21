import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
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

    @Column({ nullable: false })
    type: string
    
    @Column({ nullable: true })
    medicalRecordDatetime: Date

    @Column({nullable: true})
    commentId: number

    @ManyToOne(() => MedicalRecord, medicalRecord => medicalRecord.files)
    medicalRecord: MedicalRecord

    @OneToOne(() => Comment, comment => comment.files)
    @JoinColumn({ name: 'commentId' })
    comment: Comment
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}