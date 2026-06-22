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

// get a sngle users + all their comments
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });

    //what if the user with specific id is not found in the db?
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// insert a new user, row
const createUser = async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: { username: req.body.username },
    });
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Username already taken" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

// change a user's username
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username: req.body.username },
    });

    res.json(updatedUser);
  } catch (err) {
    if (err.code === "P2025") {
      //this is for user not found, cannot update a username if user is not there
      return res.status(303).json({ error: "User not found" });
    }
    if (err.code == "P2002") {
      //if the new username is already taken, throw error
      return res.status(409).json({ error: "Username already taken" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
};

// remove a user
const delteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "User deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      //this is for user not found, cannot delete a iser if user is not there
      return res.status(303).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, delteUser };
