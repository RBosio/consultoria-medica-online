import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Province } from './province.entity'
import { User } from './user.entity'

@Entity()
export class City {
    @PrimaryColumn()
    zipCode: string

    @Column()
    name: string

    @Column()
    provinceId: number

    @ManyToOne(() => Province, province => province.cities)
    province: Province

    @OneToMany(() => User, user => user.city)
    users: User[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}