const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/userController");

router.get("/", getUsers); // GET / users
router.get("/:id", () => {});
router.post("/", () => {});
router.put("/:id", () => {});
router.delete("/:id", () => {});

module.exports = router;
