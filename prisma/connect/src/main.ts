import { PrismaClient } from '@prisma/client';

interface VersionInfo {
  version: string;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Connected to the TiDB cluster.');

    const res = await prisma.$queryRaw<VersionInfo[]>`SELECT VERSION() as version;`;
    console.log(res[0].version);
  } catch (err) {
    console.error('❌ Failed to connect to the TiDB cluster.')
  } finally {
    await prisma.$disconnect();
  }
}

main().then(_ => null);
