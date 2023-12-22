import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class MedicalRecord {
    @PrimaryColumn()
    datetime: Date

    @PrimaryColumn()
    detail: string
    
    @Column()
    observations: string
}