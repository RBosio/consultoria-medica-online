import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column()
    price: number
    
    @OneToMany(() => Doctor, doctors => doctors.plan)
    doctors: Doctor[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}