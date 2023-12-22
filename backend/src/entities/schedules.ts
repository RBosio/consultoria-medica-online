import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    day: string
    
    @Column()
    start_hour: string
        
    @Column()
    end_hour: string
    
    @ManyToOne(() => Doctor, doctor => doctor.schedules, {nullable: false})
    doctor: Doctor
}