import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { City } from './city.entity'
import { hash, compare } from 'bcryptjs'
import { Doctor } from './doctor.entity'
import { Meeting } from './meeting.entity'
import { HealthInsurance } from './health-insurance.entity'
import { Comment } from './comment.entity'

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
    image: string
    
    @Column({default: false})
    validateHealthInsurance: boolean
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @ManyToOne(() => City, city => city.users)
    city: City
    
    @ManyToMany(() => HealthInsurance, healthInsurances => healthInsurances.users)
    healthInsurances: HealthInsurance[]

    @OneToOne(() => Doctor, {nullable: false})
    doctor: Doctor

    @OneToMany(() => Meeting, meetings => meetings.user)
    meetings: Meeting[]

    @OneToMany(() => Comment, comments => comments.user)
    comments: Comment[]

    @BeforeInsert()
    async hashPassword() {
        if (!this.password) {
            return
        } else {
            this.password = await hash(this.password, 10)
        }
    }

    async comparePassword(password: string) {
        if (await compare(password, this.password)) {
            return true
        } else {
            return false
        }
    }
}