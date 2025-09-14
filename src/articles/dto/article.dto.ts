import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ example: 'Getting Started with NestJS' })
  title: string;

  @ApiProperty({
    example: 'A comprehensive guide to building APIs with NestJS framework',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
  })
  body: string;

  @ApiProperty({ example: true, required: false })
  published?: boolean;
}

export class UpdateArticleDto {
  @ApiProperty({ example: 'Getting Started with NestJS', required: false })
  title?: string;

  @ApiProperty({
    example: 'A comprehensive guide to building APIs with NestJS framework',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example:
      'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
    required: false,
  })
  body?: string;

  @ApiProperty({ example: true, required: false })
  published?: boolean;
}
