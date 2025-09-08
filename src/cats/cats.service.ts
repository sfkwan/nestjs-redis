import { Inject, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CatsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  create(createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  async findAll() {
    this.logger.info('Fetching all cats with simulated delay...');
    const currentDate: string = new Date().toLocaleString();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return `This action returns all cats  ${currentDate}`;
  }

  async findOne(id: number) {
    this.logger.info(`Fetching cats with id ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentDate: string = new Date().toLocaleString();
    return `This action returns a #${id} cat with timestamp ${currentDate}`;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
