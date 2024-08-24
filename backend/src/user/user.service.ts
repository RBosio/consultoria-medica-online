import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { UserHealthInsurance } from 'src/entities/userHealthInsurances.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserHealthInsurance)
    private userHealthInsuranceRepository: Repository<UserHealthInsurance>,
    private healthInsuranceService: HealthInsuranceService,
  ) { }

  async findAll(
    page: number,
    name: any,
    role: number,
    ascName: number,
    ascSurname: number,
  ): Promise<User[]> {
    const usersFound = await this.userRepository.find({
      relations: {
        healthInsurances: {
          healthInsurance: true,
        },
        doctor: {
          specialities: true,
          plan: true,
        },
      },
      where: {
        admin: false,
        name: Like(`%${name}%`),
        doctor: {
          id: (() => {
            if (role) {
              if (role === 1) {
                return IsNull();
              }

              if (role === 2) {
                return Not(IsNull());
              }
            }
          })(),
        },
      },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });

    usersFound.map((user) => (user.password = ''));

    if (ascName === 1) {
      return usersFound.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (ascName === 2) {
      return usersFound.sort((a, b) => (a.name < b.name ? 1 : -1));
    }

    if (ascSurname === 1) {
      return usersFound.sort((a, b) => (a.surname > b.surname ? 1 : -1));
    } else if (ascSurname === 2) {
      return usersFound.sort((a, b) => (a.surname < b.surname ? 1 : -1));
    }

    return usersFound;
  }

  async count(name: any, role: number) {
    if (name && name !== '' && role) {
      if (role === 1) {
        return this.userRepository.count({
          where: {
            name: Like(`%${name}%`),
            doctor: {
              id: IsNull(),
            },
          },
        });
      }

      if (role === 2) {
        return this.userRepository.count({
          where: {
            name: Like(`%${name}%`),
            doctor: {
              id: Not(IsNull()),
            },
          },
        });
      }
    }

    if (name && name !== '') {
      return this.userRepository.count({
        where: {
          name: Like(`%${name}%`),
        },
      });
    }

    if (role && role === 1) {
      return this.userRepository.count({
        where: {
          doctor: {
            id: IsNull(),
          },
        },
      });
    }

    if (role && role === 2) {
      return this.userRepository.count({
        where: {
          doctor: {
            id: Not(IsNull()),
          },
        },
      });
    }

    return this.userRepository.count();
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

    return newUser;
  }

  async addHealthInsurance(id: number, healthInsuranceId: number, cod: string) {
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
      cod,
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

    const hiUser = await this.userHealthInsuranceRepository.find({
      where: {
        userId: id,
      },
    });

    updateUser.healthInsurances = hiUser;

    return this.userRepository.save(updateUser);
  }

  async clearHI(id: number) {
    const entities = await this.userHealthInsuranceRepository.find({
      where: {
        user: {
          id,
        },
      },
    });

    await this.userHealthInsuranceRepository.remove(entities);

    return 'removed';
  }

  async unsetHI(hi_id: number, req: any) {
    const result = await this.userHealthInsuranceRepository.delete({
      userId: req.user.id,
      healthInsuranceId: hi_id,
    });

    if (result.affected === 0) {
      throw new HttpException(
        'No se ha podido eliminar la obra social',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  async delete(dni: string) {
    const result = await this.userRepository.delete({ dni });

    if (result.affected === 0) {
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
    dni: string,
    name: string,
    url: string,
    healthInsuranceId: number,
  ) {
    const hi = await this.userHealthInsuranceRepository.findOne({
      where: {
        user: {
          dni,
        },
        healthInsuranceId,
      },
    });
    if (!hi) {
      throw new HttpException(
        'Obra social no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userHealthInsuranceRepository.save(hi);
  }

  async loadUsers() {
    await this.create({
      dni: '33429120',
      email: 'user@gmail.com',
      name: 'Alejandro',
      surname: 'Torres',
      password: '123456',
      phone: '341671235',
      address: 'Laprida 950',
      cuit: '20-33429120-1',
      birthday: new Date('1993-04-01'),
      gender: false,
      city: 82084,
      image: 'user.jpg',
    });

    await this.create({
      dni: '38233911',
      email: 'doctor@gmail.com',
      name: 'Sebastián',
      surname: 'López',
      password: '123456',
      image: 'doctor8m.jpg',
      phone: '3416712356',
      address: 'Corrientes 2351',
      cuit: '20-38233911-1',
      birthday: new Date('1978-08-14'),
      gender: false,
      city: 82084,
    });

    await this.create({
      dni: '34266592',
      email: 'admin@gmail.com',
      name: 'Valeria',
      surname: 'Sánchez',
      password: '123456',
      phone: '0115612324',
      address: 'Urquiza 1996',
      cuit: '20-33429120-1',
      birthday: new Date('1993-04-01'),
      gender: true,
      city: 82084,
      image: 'user2.jpg',
    });

    await this.create({
      dni: '33419160',
      email: 'martin@mail.com',
      name: 'Martín',
      surname: 'Yodice',
      password: '123456',
      phone: '0115612324',
      address: 'Urquiza 1996',
      cuit: '20-33419160-1',
      birthday: new Date('1995-05-26'),
      gender: true,
      city: 82084,
    });
  }
}
