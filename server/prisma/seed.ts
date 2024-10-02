import { prisma } from "../src/prsima/prisma";

const products = [
  {
    name: "Bluetooth speaker",
    image: "placeholder.jpg",
    stocks: 6,
    price: 126000,
  },
  {
    name: "Headphone",
    image: "placeholder.jpg",
    stocks: 10,
    price: 60000,
  },
  {
    name: "Laptop charger",
    image: "placeholder.jpg",
    stocks: 7,
    price: 220000,
  },
  {
    name: "LCD Monitor",
    image: "placeholder.jpg",
    stocks: 1,
    price: 600000,
  },
];

const main = async () => {
  await prisma.products.deleteMany();

  await prisma.products.createMany({
    data: products,
  });
};

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
