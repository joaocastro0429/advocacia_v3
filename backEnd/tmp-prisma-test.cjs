const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

(async () => {
  try {
    console.log('Database URL:', process.env.DATABASE_URL ? 'set' : 'not set');
    console.log('Running test findUnique...');
    const user = await prisma.user.findUnique({ where: { email: 'testuser+1@example.com' } });
    console.log('Result:', user);
  } catch (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
})();
