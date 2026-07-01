require("dotenv").config()
require("colors")

const SECRET_KEY = process.env.SECRET_KEY || "secret_dev"
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const BCRYPT_WORK_FACTOR = 13

// Prisma reads the connection string directly from the DATABASE_URL env var
// (see prisma/schema.prisma -> datasource db). We surface it here only for
// logging/debugging so the whole config lives in one place.
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/student_store?schema=public"

console.log("Student Store Config:".red)
console.log("PORT:".blue, PORT)
console.log("BCRYPT_WORK_FACTOR:".blue, BCRYPT_WORK_FACTOR)
console.log("DATABASE_URL:".blue, DATABASE_URL)
console.log("---")

module.exports = {
  PORT,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  DATABASE_URL,
}
