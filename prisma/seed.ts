import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error'],
});

async function main() {
  console.log('Start seeding articles...');

  // Create sample articles
  const articles = [
    {
      title: 'Getting Started with NestJS',
      description:
        'A comprehensive guide to building APIs with NestJS framework',
      body: 'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. It uses modern JavaScript, is built with TypeScript and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).',
      published: true,
    },
    {
      title: 'Understanding Prisma ORM',
      description: 'Learn how to use Prisma for type-safe database access',
      body: 'Prisma is a next-generation ORM that can be used to access a database in Node.js and TypeScript applications. It provides type-safe database access and reduces boilerplate code. Prisma consists of three main tools: Prisma Client, Prisma Migrate, and Prisma Studio.',
      published: true,
    },
    {
      title: 'Redis Caching in Node.js Applications',
      description: 'Implementing caching strategies with Redis',
      body: 'Redis is an open-source, in-memory data structure store that can be used as a database, cache, and message broker. In Node.js applications, Redis is commonly used for caching to improve performance and reduce database load.',
      published: false,
    },
  ];

  for (const article of articles) {
    const createdArticle = await prisma.article.upsert({
      where: { title: article.title },
      update: article,
      create: article,
    });
    console.log(`Upserted article: ${createdArticle.title}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
