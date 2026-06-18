const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "asc",
    },
  });

  res.json(users);
};

const createUser = async (req, res) => {
  const newUser = await prisma.user.create({
    data: {
      name: req.body.name, //devarsh << comes from the front end, through request > body
      email: req.body.email,
    },
  });

  res.json(newUser);
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      name: req.body.name,
      email: req.body.email,
    },
  });

  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.json({ message: "User deleted successfully" });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
