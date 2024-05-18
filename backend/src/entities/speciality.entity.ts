import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Meeting } from './meeting.entity';

@Entity()
export class Speciality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Meeting, (meeting) => meeting.healthInsurance)
  meeting: Meeting;

  @ManyToMany(() => Doctor, (doctors) => doctors.specialities)
  doctors: Doctor[];

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
