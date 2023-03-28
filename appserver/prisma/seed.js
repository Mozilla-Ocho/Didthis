const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 
(async function main() {
  try {
    const record1 = await prisma.DummyRecord.upsert({
      where: { name: 'Dummy Record 1' },
      update: {},
      create: {
        name: 'Dummy Record 1',
      },
    });
    console.log('Upsert 1 record: ', record1);
  } catch(e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

