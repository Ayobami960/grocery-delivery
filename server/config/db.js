import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {
    arrayMode: false,
    fullResults: false,
});
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
//# sourceMappingURL=db.js.map