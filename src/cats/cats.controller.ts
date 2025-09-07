import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Public } from '../auth/public';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CacheService } from '../cache/cache.service';
import { LoggingInterceptor } from '../logging/logging.interceptor';
import { CustomCacheInterceptor } from '../custom-cache/custom-cache.interceptor';

@UseInterceptors(LoggingInterceptor)
@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    private readonly catsService: CatsService,
  ) {}

  @Post()
  @Roles(['user'])
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @Public()
  @UseInterceptors(CustomCacheInterceptor)
  async findAll() {
    this.logger.info('Inside findAll method of CatsController');
    // const cacheKey = `cats:all`;

    // // Try cache first
    // const data = (await this.cacheService.get(cacheKey)) as string;
    // this.logger.info(`Cached cats: ${data}`);
    // if (data) {
    //   return data;
    // }

    const cats = await this.catsService.findAll();

    // await this.cacheService.set(cacheKey, cats, 600);

    return cats;
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const cacheKey = `cats:${id}`;

    // Try cache first
    const data = await this.cacheService.get<string>(cacheKey);
    this.logger.info(`Cached cats with id ${id}: ${data}`);
    if (data) {
      return data;
    }

    const cat = await this.catsService.findOne(+id);
    await this.cacheService.set(cacheKey, cat, 60);

    return cat;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    const cacheKey = `cats:${id}`;

    const result = await this.cacheService.delete(cacheKey);
    this.logger.info(`Delete cache cat with id ${id} result: ${result}`);
    return this.catsService.remove(+id);
  }
}
