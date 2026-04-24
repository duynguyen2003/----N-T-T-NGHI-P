const { initializeDatabase } = require('./src/Backend/config/database');
const prisma = initializeDatabase();

async function main() {
  await prisma.user.updateMany({
    data: { isActive: true }
  });
  console.log('All users unlocked');
}

main().finally(() => prisma.$disconnect());
