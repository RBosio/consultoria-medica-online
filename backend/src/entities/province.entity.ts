import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Country } from './country.entity'
import { City } from './city.entity'

@Entity()
export class Province {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    countryId: number

    @ManyToOne(() => Country, country => country.provinces, {nullable: false})
    country: Country

    @OneToMany(() => City, cities => cities.province)
    cities: City[]
    
    @Column({type: Date, default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date
}