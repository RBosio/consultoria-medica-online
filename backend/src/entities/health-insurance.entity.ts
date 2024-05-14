import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserHealthInsurance } from './userHealthInsurances.entity';
import { Notification } from './notification.entity';
import { Meeting } from './meeting.entity';

@Entity()
export class HealthInsurance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  discount: number;

  @OneToMany(() => Meeting, (meeting) => meeting.healthInsurance)
  meeting: Meeting;

  @OneToMany(() => Notification, (notification) => notification.healthInsurance)
  notifications: Notification[];

  @OneToMany(
    () => UserHealthInsurance,
    (userHealthInsurance) => userHealthInsurance.healthInsurance,
  )
  users: UserHealthInsurance[];

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
