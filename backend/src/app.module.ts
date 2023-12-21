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
        entities: [Country, Province, City, User],
        synchronize: configService.get('DB_SYNC'),
        dropSchema: configService.get('DB_DROP')
      }),
      inject: [ConfigService],
    }),
    CountryModule,
    ProvinceModule,
    CityModule,
    UserModule
    ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {

}