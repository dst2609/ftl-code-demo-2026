const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  delteUser,
} = require("../controllers/userController");

router.get("/", getUsers); // GET /users
router.get("/:id", getUserById); //GET /users/1
router.post("/", createUser); //POST /users
router.put("/:id", updateUser); //PUT /users/1
router.delete("/:id", delteUser); //DELETE /users/1

module.exports = router;
