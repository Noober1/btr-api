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

  await prisma.major.createMany({
    data: [
      { code: 'TKJ', name: 'Teknik Komputer dan jaringan' },
      { code: 'TKR', name: 'Teknik Kendaraan Ringan' },
      { code: 'JB', name: 'Tata Boga' },
      { code: 'TBSM', name: 'Teknik dan Bisnis Sepeda Motor' },
      { code: 'APH', name: 'Perhotelan' },
    ],
  });
  console.log('Seeding major OK');

  const getMajor = await prisma.major.findFirst();
  await prisma.student.createMany({
    data: [
      {
        email: 'student@mail.com',
        fullname: 'Student name',
        birthDate: new Date('04/06/1998'),
        birthPlace: 'Subang',
        majorId: getMajor.id,
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
