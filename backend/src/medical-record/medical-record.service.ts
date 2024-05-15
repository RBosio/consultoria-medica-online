import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMedicalRecordDto } from './dto/create-medical-record.dto';
import { updateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { UserService } from 'src/user/user.service';
import { File } from 'src/entities/file.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(File) private fileRepository: Repository<File>,
    private meetingService: MeetingService,
  ) {}

  findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find();
  }

  async findByUser(userId: number, page: number): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: {
        meeting: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        meeting: {
          user: true,
          doctor: {
            user: true,
            specialities: true,
          },
        },
        files: true,
      },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
  }

  async findOne(id: number): Promise<MedicalRecord> {
    const medicalRecordFound = await this.medicalRecordRepository.findOne({
      where: {
        id,
      },
      relations: ['meeting'],
    });
    if (!medicalRecordFound) {
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);
    }

    return medicalRecordFound;
  }

  async getPages(userId: number): Promise<number> {
    const [_, count] = await this.medicalRecordRepository.findAndCount({
      where: {
        meeting: {
          user: {
            id: userId,
          },
        },
      },
    });
    return Math.round(count / 10);
  }

  async create(
    medicalRecord: createMedicalRecordDto,
  ): Promise<MedicalRecord | HttpException> {
    const medicalRecordFound = await this.medicalRecordRepository.findOne({
      where: {
        datetime: medicalRecord.datetime,
      },
    });
    if (medicalRecordFound) {
      throw new HttpException('Registro existente', HttpStatus.BAD_REQUEST);
    }

    let newMedicalRecord = this.medicalRecordRepository.create(medicalRecord);

    const meetingFound = await this.meetingService.findOne(
      medicalRecord.userId,
      medicalRecord.startDatetime,
    );

    newMedicalRecord.meeting = meetingFound;

    newMedicalRecord = await this.medicalRecordRepository.save(
      newMedicalRecord,
    );

    // await this.meetingService.update(
    //   meetingFound.userId,
    //   meetingFound.startDatetime,
    //   meetingFound,
    // );

    return newMedicalRecord;
  }

  async update(id: number, medicalRecord: updateMedicalRecordDto) {
    const medicalRecordFound = await this.medicalRecordRepository.findOne({
      where: {
        id,
      },
    });
    if (!medicalRecordFound) {
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);
    }

    const updateMedicalRecord = Object.assign(
      medicalRecordFound,
      medicalRecord,
    );
    return this.medicalRecordRepository.save(updateMedicalRecord);
  }

  async delete(id: number) {
    const medicalRecord = await this.findOne(id);

    await this.meetingService.update(
      medicalRecord.meeting.userId,
      medicalRecord.meeting.startDatetime,
      medicalRecord.meeting,
    );

    const result = await this.medicalRecordRepository.delete({ id });

    if (result.affected == 0) {
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async uploadFile(id: number, body: any) {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: {
        id,
      },
    });
    if (!medicalRecord) {
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);
    }

    const { url, name, type } = body;

    const f = {
      url,
      name,
      type,
    };
    const file = this.fileRepository.create(f);
    file.medicalRecord = medicalRecord;

    return await this.fileRepository.save(file);
  }
}
