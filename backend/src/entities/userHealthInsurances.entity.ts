import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { HealthInsurance } from './health-insurance.entity';

@Entity()
export class UserHealthInsurance {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  healthInsuranceId: number;

  @Column({ nullable: true })
  cod: string;

  @ManyToOne(() => User, (user) => user.meetings, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => HealthInsurance, { nullable: false })
  @JoinColumn({ name: 'healthInsuranceId' })
  healthInsurance: HealthInsurance;

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
