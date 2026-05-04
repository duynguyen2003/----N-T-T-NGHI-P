require('dotenv').config();
const { getPrisma } = require('./src/Backend/config/database');

async function main() {
  const prisma = getPrisma();
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      code: true,
      title: true,
    }
  });
  console.log('--- DATABASE COURSES ---');
  console.log(JSON.stringify(courses, null, 2));
}

main()
  .catch(e => console.error(e));
