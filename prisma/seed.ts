import prisma from "../src/lib/prisma";

async function main() {
  // 1. Seed Users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@prisma.io" },
      update: { name: "Alice" },
      create: { email: "alice@prisma.io", name: "Alice" },
    }),
    prisma.user.upsert({
      where: { email: "bob@prisma.io" },
      update: { name: "Bob" },
      create: { email: "bob@prisma.io", name: "Bob" },
    }),
  ]);

  // 2. Seed Farmers
  const farmers = await Promise.all([
    prisma.farmer.upsert({
      where: { mobile: "9820012345" },
      update: {},
      create: {
        name: "Sanjay Deshmukh",
        mobile: "9820012345",
        password: "hashed_password_1", // Remember to hash this!
      },
    }),
    prisma.farmer.upsert({
      where: { mobile: "9970054321" },
      update: {},
      create: {
        name: "Sunita Kulkarni",
        mobile: "9970054321",
        password: "hashed_password_2",
      },
    }),
    prisma.farmer.upsert({ // Fixed: Changed .farmers to .farmer.upsert
      where: { mobile: "9422098765" },
      update: {},
      create: {
        name: "Vijay Patil",
        mobile: "9422098765",
        password: "hashed_password_3",
      },
    }),
  ]);

  console.log(`Seeded ${users.length} users and ${farmers.length} farmers.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });