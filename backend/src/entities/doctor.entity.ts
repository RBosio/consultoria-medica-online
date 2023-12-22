import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Schedule } from './schedules'

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    registration: string
    
    @Column()
    speciality: string
    
    @Column()
    cuil: string
    
    @Column()
    title: string
    
    @OneToOne(() => User, {nullable: false})
    @JoinColumn()
    user: User
    
    // @OneToMany(() => Consultation, consultations => consultations.doctor)
    // consultations: Consultation[]

    @OneToMany(() => Schedule, schedules => schedules.doctor)
    schedules: Schedule[]
}