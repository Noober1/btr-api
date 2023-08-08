import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    data: [
      {
        email: 'student@mail.com',
        fullname: 'Student name',
        birthDate: new Date('04/06/1998'),
        birthPlace: 'Subang',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Seeding student OK');

  const hashedPassword = await bcrypt.hash('lordazzura123', 10);
  const getTeacher = await prisma.teacher.findUnique({
    where: { email: 'example@mail.com' },
  });
  if (getTeacher) {
    await prisma.user.upsert({
      where: {
        teacherId: getTeacher.id,
      },
      update: {
        password: hashedPassword,
      },
      create: {
        username: 'vulnerablev1',
        password: hashedPassword,
        role: 'TEACHER',
        teacherId: getTeacher.id,
      },
    });
  }
  console.log('Seeding user OK');
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
