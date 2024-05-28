import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { File } from './file.entity';

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datetime: Date;

  @Column({ length: 500 })
  detail: string;

  @Column({ nullable: true, length: 500 })
  observations: string;

  @OneToOne(() => Meeting, (meeting) => meeting.medicalRecord, {
    nullable: false,
  })
  meeting: Meeting;

  @OneToMany(() => File, (files) => files.medicalRecord)
  files: File[];
}
