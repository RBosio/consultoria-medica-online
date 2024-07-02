import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from 'src/entities/doctor.entity';
import { UserService } from 'src/user/user.service';
import { getDoctorsDto } from './dto/get-doctors.dto';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { SpecialityService } from 'src/speciality/speciality.service';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { PlanService } from 'src/plan/plan.service';
import { createDoctorDto } from './dto/create-doctor.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Speciality } from 'src/entities/speciality.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    @InjectRepository(Speciality)
    private specialityRepository: Repository<Speciality>,
    private userService: UserService,
    private specialityService: SpecialityService,
    private planService: PlanService,
    private healthInsuranceService: HealthInsuranceService,
  ) {}

  async create(userIdToAssociate: number, doctor: createDoctorDto) {
    const user = await this.userService.findOne(userIdToAssociate);
    if (!user)
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);

    const doctorExists = await this.doctorRepository.findOne({
      where: { userId: userIdToAssociate },
    });
    if (doctorExists)
      throw new HttpException(
        'El usuario ya está registrado como médico',
        HttpStatus.BAD_REQUEST,
      );

    // Validar archivos
    const eightMB = 1024 * 1024 * 8;

    const validMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!validMimeTypes.includes(doctor.registration.mimeType)) {
      throw new HttpException(
        `El archivo de matrícula no posee un tipo válido. Permitidos: ${validMimeTypes}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (doctor.registration.size > eightMB) {
      throw new HttpException(
        `El archivo de matrícula debe tener un peso menor a 8MB`,
        HttpStatus.NOT_FOUND,
      );
    }
    const registrationFilename = `${uuidv4()}.${
      doctor.registration.fileType.ext
    }`;

    if (!validMimeTypes.includes(doctor.title.mimeType)) {
      throw new HttpException(
        `El archivo de título no posee un tipo válido. Permitidos: ${validMimeTypes}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (doctor.title.size > eightMB) {
      throw new HttpException(
        `El archivo de título debe tener un peso menor a 8MB`,
        HttpStatus.NOT_FOUND,
      );
    }
    const titleFilename = `${uuidv4()}.${doctor.title.fileType.ext}`;

    const registrationPath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      'doctor',
      'registration',
    );
    const titlePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      'doctor',
      'title',
    );

    fs.mkdirSync(registrationPath, { recursive: true });
    fs.mkdirSync(titlePath, { recursive: true });
    await fs.promises.writeFile(
      path.join(registrationPath, registrationFilename),
      doctor.registration.buffer,
    );
    await fs.promises.writeFile(
      path.join(titlePath, titleFilename),
      doctor.title.buffer,
    );

    const newDoctor = await this.doctorRepository.create(doctor);

    const specialitiesIds = JSON.parse(doctor.specialitiesStr);
    const specialities = await this.specialityRepository.findBy({
      id: In(specialitiesIds),
    });

    newDoctor.user = user;
    newDoctor.registration = registrationFilename;
    newDoctor.title = titleFilename;
    newDoctor.specialities = specialities;
    newDoctor.employmentDate = doctor.employmentDate;

    await this.doctorRepository.save(newDoctor);

    return newDoctor;
  }

  async findAll(query: getDoctorsDto) {
    const {
      name,
      avgRate,
      seniority,
      specialityId,
      healthInsuranceId,
      orderBy,
      page,
      perPage,
    } = query;
    const moment = extendMoment(Moment);

    let doctorsFound: Doctor[] = [];

    doctorsFound = await this.doctorRepository.find({
      where: {
        verified: true,
        planId: Not(IsNull()),
        priceMeeting: Not(IsNull()),
        durationMeeting: Not(IsNull()),
        cbu: Not(IsNull()),
      },
      order: {
        plan: {
          price: 'DESC',
        },
      },
      relations: {
        user: {
          healthInsurances: true,
        },
        specialities: true,
        plan: true,
        schedules: true,
      },
    });

    doctorsFound = doctorsFound.filter((doctor) => {
      return doctor.schedules.length > 0;
    });

    // FILTER
    if (name) {
      doctorsFound = doctorsFound.filter((doctor) => {
        const fullName =
          `${doctor.user.name} ${doctor.user.surname}`.toLowerCase();
        const nameToSearch = name.toLowerCase();
        return fullName.includes(nameToSearch);
      });
    }

    if (avgRate) {
      doctorsFound = doctorsFound.filter((doctor) => doctor.avgRate >= avgRate);
    }

    if (specialityId) {
      const speciality = await this.specialityService.findOne(specialityId);
      if (!speciality)
        throw new HttpException(
          `Especialidad de ID: ${healthInsuranceId} inexistente`,
          HttpStatus.BAD_REQUEST,
        );
      doctorsFound = doctorsFound.filter((doctor) =>
        doctor.specialities.some((val) => val.id === speciality.id),
      );
    }

    const dateNow = moment(new Date());
    doctorsFound = doctorsFound.map((doctor) => {
      const employmentDate = moment(doctor.employmentDate);
      const diff = dateNow.diff(employmentDate, 'years');

      return { ...doctor, seniority: diff };
    });

    if (seniority) {
      doctorsFound = doctorsFound.filter(
        (doctor) => doctor.seniority >= seniority,
      );
    }

    if (healthInsuranceId) {
      const hI = await this.healthInsuranceService.findOne(healthInsuranceId);
      if (!hI)
        throw new HttpException(
          `Obra social de ID: ${healthInsuranceId} inexistente`,
          HttpStatus.BAD_REQUEST,
        );
      doctorsFound = doctorsFound.filter((doc) =>
        doc.user.healthInsurances
          .map((h) => h.healthInsuranceId)
          .includes(hI.id),
      );
    }

    doctorsFound = doctorsFound.map((doctor) => {
      delete doctor.user.password;
      return doctor;
    });

    let paginatedItems = this.paginate(doctorsFound, page, perPage);

    if (orderBy) paginatedItems = this.order(paginatedItems, orderBy);

    return paginatedItems;
  }

  async findAllAdvertisedDoctors() {
    let doctorsFound = await this.doctorRepository.find({
      where: {
        plan: {
          id: In([2,3]),
        },
        verified: true,
      },
      relations: {
        specialities: true,
        user: {
          healthInsurances: {
            healthInsurance: true,
          },
        },
      },
    });

    doctorsFound = doctorsFound.map((doctor) => {
      delete doctor.user.password;
      return doctor;
    });

    return this.randomDoctors(doctorsFound, 3);
  }

  randomDoctors(doctors: Doctor[], max: number) {
    if (max > doctors.length)
      throw new HttpException(
        'Maximo mayor a la cantidad de doctores',
        HttpStatus.BAD_REQUEST,
      );
    const set = new Set();
    const d = [];

    for (let i = 0; i < max; ) {
      const randomIndex = Math.floor(Math.random() * doctors.length);
      if (!set.has(randomIndex)) {
        set.add(randomIndex);
        d.push(doctors[randomIndex]);
        i++;
      }
    }

    return d;
  }

  paginate(items, page, perPage = 10) {

    if(!page) {
      return {
        previousPage: null,
        currentPage: 1,
        nextPage: null,
        total: items.length,
        totalPages: 1,
        items: items,
      }
    };

    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);

    return {
      previousPage: page - 1 ? page - 1 : null,
      currentPage: page,
      nextPage: totalPages > page ? page + 1 : null,
      total: items.length,
      totalPages: totalPages,
      items: paginatedItems,
    };
  }

  order(paginatedItems, orderBy) {
    const regex = /^(.+)_(asc|desc)$/;
    const paginatedItemsCpy = { ...paginatedItems };
    if (!regex.test(orderBy))
      throw new HttpException(
        'orderBy debe ser de formato: (param)_[asc|desc]',
        HttpStatus.BAD_REQUEST,
      );

    const [param, order] = orderBy.split('_');

    if (param === 'name') {
      if (order.toLowerCase() === 'asc') {
        paginatedItemsCpy.items = paginatedItemsCpy.items.sort((x, y) =>
          x.user.name > y.user.name ? 1 : -1,
        );
      }
      if (order.toLowerCase() === 'desc') {
        paginatedItemsCpy.items = paginatedItemsCpy.items.sort((x, y) =>
          x.user.name > y.user.name ? -1 : 1,
        );
      }
    }

    if (param === 'rate') {
      if (order.toLowerCase() === 'asc') {
        paginatedItemsCpy.items = paginatedItemsCpy.items.sort((x, y) =>
          x.avgRate > y.avgRate ? 1 : -1,
        );
      }
      if (order.toLowerCase() === 'desc') {
        paginatedItemsCpy.items = paginatedItemsCpy.items.sort((x, y) =>
          x.avgRate > y.avgRate ? -1 : 1,
        );
      }
    }

    if (param === 'seniority') {
      if (order.toLowerCase() === 'asc') {
        paginatedItemsCpy.items = paginatedItemsCpy.items.sort((x, y) =>
          x.seniority > y.seniority ? 1 : -1,
        );
      }
      if (order.toLowerCase() === 'desc') {
        paginatedItemsCpy.items = paginatedItemsCpy.items.sort((x, y) =>
          x.seniority > y.seniority ? -1 : 1,
        );
      }
    }

    return paginatedItemsCpy;
  }

  async findOne(id: number) {
    const doctorFound = await this.doctorRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: {
          healthInsurances: true,
        },
        schedules: true,
        specialities: true,
      },
    });

    if (!doctorFound) {
      throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
    }

    delete doctorFound.user.password;

    return doctorFound;
  }

  async findOneByUserId(id: number) {
    const doctorFound = await this.doctorRepository.findOne({
      where: {
        user: {
          id,
        },
      },
      relations: {
        user: {
          healthInsurances: {
            healthInsurance: true,
          },
        },
        specialities: true,
        plan: true,
        schedules: true,
      },
    });

    delete doctorFound?.user?.password;

    return doctorFound;
  }

  async verify(id: number) {
    const doctorFound = await this.doctorRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!doctorFound) {
      throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
    }

    doctorFound.verified = true;
    doctorFound.verifiedSince = new Date();

    return this.doctorRepository.save(doctorFound);
  }

  async update(id: number, doctor: updateDoctorDto) {
    let doctorFound = null;
    if (doctor.userId) {
      doctorFound = await this.doctorRepository.findOne({
        where: {
          user: {
            id: doctor.userId,
          },
        },
        relations: ['user'],
      });
    } else {
      doctorFound = await this.doctorRepository.findOne({
        where: {
          id,
        },
        relations: ['user'],
      });
    }

    if (!doctorFound) {
      throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
    }

    if (doctor.planId) {
      const plan = await this.planService.findOne(doctor.planId);
      doctorFound.plan = plan;
      doctorFound.planSince = new Date();
    }

    const updateDoctor = Object.assign(doctorFound, doctor);
    return this.doctorRepository.save(updateDoctor);
  }

  async cancelPlan(id: number) {
    const doctor = await this.findOne(id);
    if (!doctor) {
      throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
    }

    doctor.plan = null;

    this.doctorRepository.save(doctor);
  }

  async delete(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    const result = await this.doctorRepository.delete({ id });

    if (result.affected == 0) {
      throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.userService.delete(doctor.user.dni);

    return result;
  }
}
