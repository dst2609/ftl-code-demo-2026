const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// get every user -
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      include: { comments: true }, //attach each user's comments
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = { getUsers };
