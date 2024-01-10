import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Doctor } from './doctor.entity'
import { Benefit } from './benefit.entity'

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

    @ManyToMany(() => Benefit, benefits => benefits.plans)
    @JoinTable()
    benefits: Benefit[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}