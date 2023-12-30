import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class HealthInsurance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column({type: 'decimal', precision: 3, scale: 2})
    discount: number
    
    @OneToMany(() => User, users => users.healthInsurance)
    users: User[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}