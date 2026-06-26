const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }
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

const login = async (req, res) => {
  //we need email and password from the req.body
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required!" });
  }

  try {
    // check if the user with that emailexists in the db.
    // if exists, compare the password
    // if correct - login successful, if incorrect password- login failed.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const correctPassword = await bcrypt.compare(password, user.password); //the first password is the current inputted password, second is from db
      if (correctPassword) {
        //successful login
        // jwt needds payload and JWT secret jwt,sign(payload, secret, [options])
        const token = jwt.sign(
          { userId: user.id, username: user.username, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        res.status(200).json({ token });
      } else {
        //wrong password
        res.status(401).json({ error: "Invalid credentials!" });
      }
    } else {
      res.status(404).json({ error: "User with that email not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };
