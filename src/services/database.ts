import prisma from "./prisma.js";

export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

export default prisma;
