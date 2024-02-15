import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserHealthInsurance } from './userHealthInsurances.entity'

@Entity()
export class HealthInsurance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column({type: 'decimal', precision: 3, scale: 2})
    discount: number
    
    @OneToMany(() => UserHealthInsurance, userHealthInsurance => userHealthInsurance.healthInsurance)
    users: UserHealthInsurance[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}