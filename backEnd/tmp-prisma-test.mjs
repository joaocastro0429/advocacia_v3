import { prisma } from './src/lib/prisma.js';

const test = async () => {
  try {
    console.log('Running test findUnique...');
    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    console.log('Result:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

test();
