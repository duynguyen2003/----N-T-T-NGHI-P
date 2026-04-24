const { initializeDatabase } = require('./src/Backend/config/database');
const prisma = initializeDatabase();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, isActive: true }
  });
  console.log(users);
}

main().finally(() => prisma.$disconnect());
