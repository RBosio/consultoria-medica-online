import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Doctor } from './doctor.entity';
import { MedicalRecord } from './medical-record.entity';
import { Comment } from './comment.entity';
import { Notification } from './notification.entity';
import { HealthInsurance } from './health-insurance.entity';
import { Speciality } from './speciality.entity';

@Entity()
export class Meeting {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  startDatetime: Date;

  @Column({ nullable: true })
  rate: number;

  @Column()
  doctorId: number;

  @Column({ default: 'Pagada' })
  status: string;

  @Column({ nullable: true })
  tpc: string;

  @Column({ default: 0, type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @Column({ nullable: true })
  motive: string;

  @Column({ default: false })
  repr: boolean;

  @ManyToOne(() => User, (user) => user.meetings, { nullable: false })
  user: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.meetings, { nullable: false })
  doctor: Doctor;

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.meeting)
  @JoinColumn()
  medicalRecord: MedicalRecord;

  @ManyToOne(
    () => HealthInsurance,
    (healthInsurance) => healthInsurance.meeting,
  )
  healthInsurance: HealthInsurance;

  @ManyToOne(() => Speciality, (speciality) => speciality.meeting)
  speciality: Speciality;

  @OneToMany(() => Comment, (comment) => comment.meeting, {
    cascade: true,
  })
  comments: Comment;

  @OneToMany(() => Notification, (notifications) => notifications.meeting, {
    cascade: true,
  })
  notifications: Notification[];

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
