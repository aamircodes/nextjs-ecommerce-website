import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      cart: {
        async update({ args, query }) {
          args.data = { ...args.data, updatedAt: new Date() };
          return query(args);
        },
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
