import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDto) {
    return await this.prisma.article.create({ data });
  }

  async findAll() {
    return await this.prisma.article.findMany();
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async update(id: string, data: UpdateArticleDto) {
    try {
      return await this.prisma.article.update({ where: { id }, data });
    } catch {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.article.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }
}
