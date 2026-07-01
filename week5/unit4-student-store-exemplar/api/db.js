const { PrismaClient } = require("@prisma/client")
require("colors")

// A single shared PrismaClient instance for the whole app. Instantiating one
// client and reusing it everywhere avoids exhausting the database connection
// pool (a new PrismaClient per request would open a new pool each time).
const prisma = new PrismaClient()

prisma
  .$connect()
  .then(() => console.log("Successfully connected to the database via Prisma!".blue))
  .catch((err) => console.error("Prisma connection error".red, err))

module.exports = prisma
