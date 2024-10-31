import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  total: number;

  @Column()
  cbu: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.billings)
  doctor: Doctor;
}
