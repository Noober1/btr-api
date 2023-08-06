import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.teacher.createMany({
    data: [
      { email: 'example@mail.com', fullname: 'Cucu Ruhiyatna' },
      { email: 'user@mail.com', fullname: 'User' },
    ],
    skipDuplicates: true,
  });
  console.log('Seeding teacher OK');

  await prisma.student.createMany({
    data: [{ email: 'student@mail.com', fullname: 'Student name' }],
    skipDuplicates: true,
  });
  console.log('Seeding student OK');

  const getTeacher = await prisma.teacher.findUnique({
    where: { email: 'example@mail.com' },
  });
  if (getTeacher) {
    await prisma.user.upsert({
      where: {
        teacherId: getTeacher.id,
      },
      update: {},
      create: {
        username: 'vulnerablev1',
        password: 'lordazzura123',
        roles: 'TEACHER',
        teacherId: getTeacher.id,
      },
    });
  }
  console.log('Seeding user OK');

  //   const alice = await prisma.user.upsert({
  //     where: { email: 'alice@prisma.io' },
  //     update: {},
  //     create: {
  //       email: 'alice@prisma.io',
  //       name: 'Alice',
  //       posts: {
  //         create: {
  //           title: 'Check out Prisma with Next.js',
  //           content: 'https://www.prisma.io/nextjs',
  //           published: true,
  //         },
  //       },
  //     },
  //   })
  //   const bob = await prisma.user.upsert({
  //     where: { email: 'bob@prisma.io' },
  //     update: {},
  //     create: {
  //       email: 'bob@prisma.io',
  //       name: 'Bob',
  //       posts: {
  //         create: [
  //           {
  //             title: 'Follow Prisma on Twitter',
  //             content: 'https://twitter.com/prisma',
  //             published: true,
  //           },
  //           {
  //             title: 'Follow Nexus on Twitter',
  //             content: 'https://twitter.com/nexusgql',
  //             published: true,
  //           },
  //         ],
  //       },
  //     },
  //   })
  //   console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
