import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
export class Speciality {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @ManyToMany(() => Doctor, doctors => doctors.specialities)
    doctors: Doctor[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}