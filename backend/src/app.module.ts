import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { CountryModule } from './country/country.module';
import { ProvinceModule } from './province/province.module';
import { CityModule } from './city/city.module';
import { User } from './entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Doctor } from './entities/doctor.entity';
import { MedicalRecord } from './entities/medical_record.entity';
import { DoctorModule } from './doctor/doctor.module';
import { Speciality } from './entities/speciality.entity';
import { SpecialityModule } from './speciality/speciality.module';
import { Schedule } from './entities/schedule.entity';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: 3306,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Country, Province, City, User, Doctor, Schedule, MedicalRecord, Speciality],
        synchronize: configService.get('DB_SYNC'),
        dropSchema: configService.get('DB_DROP')
      }),
      inject: [ConfigService],
    }),
    CountryModule,
    ProvinceModule,
    CityModule,
    UserModule,
    AuthModule,
    DoctorModule,
    SpecialityModule,
    ScheduleModule
    ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {

}