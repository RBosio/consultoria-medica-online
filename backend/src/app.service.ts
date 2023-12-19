import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  readSqlFile(filepath: string): string[] {
      return fs
        .readFileSync(join(__dirname, '..', filepath))
        .toString()
        .replace(/\r?\n|\r/g, '')
        .split(';')
        .filter((query) => query?.length);
    }
}
