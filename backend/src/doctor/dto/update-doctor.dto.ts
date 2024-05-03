import { Speciality } from 'src/entities/speciality.entity';

export class updateDoctorDto {
  registration?: string;
  title?: string;
  durationMeeting?: number;
  priceMeeting?: number;
  avgRate?: number;
  description?: string;
  planId?: number;
  userId?: number;
  specialities?: Speciality[];
  cbu?: string;
  alias?: string;
}
