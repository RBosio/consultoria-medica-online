import {
  IsEmail,
  IsDefined,
  Length,
  Matches,
  IsDateString,
  IsIn,
  IsInt,
} from 'class-validator';

export class createUserDto {
  @IsDefined()
  @Length(1)
  name: string;

  @IsDefined()
  @Length(1)
  surname: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @Length(8)
  password: string;

  @IsDefined()
  @Matches(/^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/)
  dni: string;

  @IsDefined()
  @Length(1)
  address: string;

  @IsDefined()
  @Matches(/^(20|23|24|27|30|33|34)\d{8}\d{1}$/gm)
  cuit: string;

  @IsDefined()
  @Matches(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/)
  phone: string;

  @IsDefined()
  @IsDateString()
  birthday: Date;

  @IsDefined()
  @IsIn([0, 1])
  gender: boolean;

  @IsDefined()
  @IsInt()
  city: number;

  image?: string;
}
