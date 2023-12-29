import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { Meeting } from './meeting.entity'
import { File } from './file.entity'

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

    @OneToMany(() => File, files => files.medicalRecord)
    files: File[]
}