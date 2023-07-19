import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

interface HelloResponse {
    msg: string;
}

async function main() {
  const res = await prisma.$queryRaw<HelloResponse[]>`SELECT 'Hello World' as msg;`;
  console.log(res[0].msg);
}

void main();
