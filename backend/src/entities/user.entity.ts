import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { City } from './city.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string

    @Column()
    surname: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    dni: string

    @Column()
    cuit: string
    
    @Column({nullable: true})
    phone: string

    @Column()
    birthday: Date
    
    @Column({default: false})
    admin: boolean
    
    @Column()
    gender: boolean
    
    @Column({default: true})
    status: boolean
 
    @Column({nullable: true})
    photo: string

    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @ManyToOne(() => City, city => city.users)
    city: City
}