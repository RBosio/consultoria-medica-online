import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { createDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { Speciality } from 'src/entities/speciality.entity';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { UserHealthInsurance } from 'src/entities/userHealthInsurances.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    @InjectRepository(UserHealthInsurance)
    private userHealthInsuranceRepository: Repository<UserHealthInsurance>,
    private healthInsuranceService: HealthInsuranceService,
  ) {}

  async findAll(): Promise<User[]> {
    const usersFound = await this.userRepository.find({
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
        doctor: {
          specialities: true,
        },
      },
      where: {
        admin: false,
      },
    });
    usersFound.map((user) => (user.password = ''));

    return usersFound;
  }

  async findOne(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    userFound.password = '';

    return userFound;
  }

  async findOneByDni(dni: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        dni,
      },
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    userFound.password = '';

    return userFound;
  }

  async findOneById(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    userFound.password = '';

    return userFound;
  }

  async findOneByEmail(email: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async findAdmin() {
    const userFound = await this.userRepository.findOne({
      where: {
        admin: true,
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    userFound.password = '';

    return userFound;
  }

  async create(user: createUserDto) {
    const userFoundDni = await this.userRepository.findOne({
      where: {
        dni: user.dni,
      },
    });
    if (userFoundDni) {
      throw new HttpException(
        'El DNI ya ha sido registrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userFoundEmail = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (userFoundEmail) {
      throw new HttpException(
        'El E-mail ya ha sido registrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    let newUser = this.userRepository.create(user);

    newUser = await this.userRepository.save(newUser);

    //TODO: REVISAR LA LÓGICA DE ABAJO SI SE PUEDE HACER EN OTROS ENDPOINTS SEPARADOS (Health Insurances)

    // newUser.healthInsurances = []

    // user.his.map(async hi => {
    //     const healthInsurance = await this.healthInsuranceService.findOne(hi)

    //     const userHI = this.userHealthInsuranceRepository.create({
    //         user: newUser,
    //         healthInsurance
    //     })
    //     await this.userHealthInsuranceRepository.save(userHI)
    // })

    return newUser;
  }

  async addHealthInsurance(id: number, healthInsuranceId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const healthInsurance = await this.healthInsuranceService.findOne(
      healthInsuranceId,
    );
    const userHI = this.userHealthInsuranceRepository.create({
      user,
      healthInsurance,
    });
    await this.userHealthInsuranceRepository.save(userHI);

    return 'health insurance added!';
  }

  async update(id: number, user: updateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const updateUser = Object.assign(userFound, user);

    if (user.password) {
      await updateUser.hashPassword();
    }

    if (user.verify) {
      const hi = await this.userHealthInsuranceRepository.findOne({
        where: {
          userId: id,
          healthInsuranceId: user.healthInsuranceId,
        },
      });
      if (!hi) {
        throw new HttpException(
          'Obra social no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      hi.verified = true;

      this.userHealthInsuranceRepository.save(hi);
    } else {
      if (user.healthInsuranceId) {
        const hi = await this.healthInsuranceService.findOne(
          user.healthInsuranceId,
        );

        const newHi = this.userHealthInsuranceRepository.create({
          userId: updateUser.id,
          healthInsurance: hi,
          user: updateUser,
        });

        await this.userHealthInsuranceRepository.save(newHi);
      }
    }
    const hiUser = await this.userHealthInsuranceRepository.find({
      where: {
        userId: id,
      },
    });

    updateUser.healthInsurances = hiUser;

    return this.userRepository.save(updateUser);
  }

  async delete(dni: string) {
    const result = await this.userRepository.delete({ dni });

    if (result.affected == 0) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async uploadImage(dni: string, url: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        dni,
      },
    });
    if (!userFound) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    userFound.image = url;
    return this.userRepository.save(userFound);
  }

  async uploadHealthInsurance(
    id: number,
    healthInsuranceId: number,
    url: string,
  ) {
    const hi = await this.userHealthInsuranceRepository.findOne({
      where: {
        userId: id,
        healthInsuranceId,
      },
    });
    if (!hi) {
      throw new HttpException(
        'Obra social no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    hi.file_url = url;

    this.userHealthInsuranceRepository.save(hi);
  }

  async loadUsers() {
    await this.create({
      dni: '33429120',
      email: 'user@gmail.com',
      name: 'User',
      surname: 'User',
      password: '123456',
      phone: '33-333333',
      cuit: '20-33429120-1',
      birthday: new Date('1993-04-01'),
      gender: false,
      city: 82084,
    });

    await this.create({
      dni: '38233911',
      email: 'doctor@gmail.com',
      name: 'Doctor',
      surname: 'Doctor',
      password: '123456',
      phone: '44-444444',
      cuit: '20-38233911-1',
      birthday: new Date('1998-08-14'),
      gender: true,
      city: 82084,
    });

    await this.create({
      dni: '34266592',
      email: 'admin@gmail.com',
      name: 'Admin',
      surname: 'Admin',
      password: '123456',
      phone: '55-555555',
      cuit: '20-33429120-1',
      birthday: new Date('1993-04-01'),
      gender: true,
      city: 82084,
    });
  }
}
