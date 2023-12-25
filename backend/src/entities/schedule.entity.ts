import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    day: number
    
    @Column()
    start_hour: number
        
    @Column()
    end_hour: number

    @Column()
    doctorId: number
    
    @ManyToOne(() => Doctor, doctor => doctor.schedules, {nullable: false})
    doctor: Doctor
}