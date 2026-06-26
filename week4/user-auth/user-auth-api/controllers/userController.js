const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ error: "email, username, password are required" });
  }

  //password length check here
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      const field = existing.email === email ? "email" : "username";
      return res.status(409).json({ error: `That ${field} already exists` });
    }

    // hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
      select: { id: true, email: true, username: true, createdAt: true },
    });

    // const token = signToken(user.id); //for later
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register };
