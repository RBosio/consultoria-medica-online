import { IsDateString, IsDefined, IsOptional } from 'class-validator';

export class createDoctorDto {
  @IsDefined()
  registration: any;

  @IsDefined()
  title: any;

  @IsDefined()
  specialitiesStr: string;

  @IsDefined()
  @IsDateString()
  employmentDate: Date;

  @IsOptional()
  cbu?: string;

  @IsOptional()
  alias?: string;
}
