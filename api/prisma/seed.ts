// api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const driverPassword = await bcrypt.hash('driver123', saltRounds);

  // Criar Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@coop.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });

  // Criar Motoristas e seus Usuários
  const driver1 = await prisma.driver.create({
    data: {
      name: 'João da Silva',
      user: {
        create: {
          email: 'joao@coop.com',
          passwordHash: driverPassword,
          role: 'driver',
        }
      }
    }
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Maria Oliveira',
      status: 'indisponivel',
      user: {
        create: {
          email: 'maria@coop.com',
          passwordHash: driverPassword,
          role: 'driver',
        }
      }
    }
  });

  // Colocar motoristas na fila
  await prisma.queuePosition.create({
    data: {
      driverId: driver1.id,
      position: 1,
    },
  });

  await prisma.queuePosition.create({
    data: {
      driverId: driver2.id,
      position: 2,
    },
  });

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