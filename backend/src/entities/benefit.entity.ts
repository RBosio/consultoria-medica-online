import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Plan } from './plan.entity'

@Entity()
export class Benefit {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @ManyToMany(() => Plan, plans => plans.benefits)
    plans: Plan[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}