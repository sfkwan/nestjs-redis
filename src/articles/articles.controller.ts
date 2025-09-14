import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/public';
import { ArticleEntity } from './entity/article.entity';

@Public()
@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({ type: CreateArticleDto })
  @ApiCreatedResponse({ type: ArticleEntity })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ArticleEntity })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an article by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateArticleDto })
  @ApiOkResponse({ type: ArticleEntity })
  @ApiResponse({ status: 404, description: 'Article not found' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an article by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: ArticleEntity })
  @ApiResponse({ status: 404, description: 'Article not found' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
